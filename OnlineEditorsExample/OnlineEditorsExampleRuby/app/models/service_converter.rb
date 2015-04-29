class ServiceConverter

  @@convert_timeout = Rails.configuration.timeout
  @@document_converter_url = Rails.configuration.urlConverter
  @@document_storage_url = Rails.configuration.urlStorage
  @@convert_params = '?url=%s&outputtype=%s&filetype=%s&title=%s&key=%s&vkey=%s'
  @@max_try = 3

  class << self

    def get_converted_uri(document_uri, from_ext, to_ext, document_revision_id, is_async)
      converted_document_uri = nil
      responce_from_convert_service = send_request_to_convert_service(document_uri, from_ext, to_ext, document_revision_id, is_async)

      file_result = responce_from_convert_service['FileResult']

      error_element = file_result['Error']
      if error_element != nil
        process_convert_service_responce_error(error_element.to_i)
      end

      is_end_convert = file_result['EndConvert'].downcase == 'true'
      percent = file_result['Percent'].to_i

      if is_end_convert
        converted_document_uri = file_result['FileUrl']
        percent = 100
      else
        percent = percent >= 100 ? 99 : percent;
      end

      return percent, converted_document_uri
    end

    def get_external_uri(content, content_length, content_type, document_revision_id)

      validate_key = generate_validate_key(document_revision_id, nil)

      url_to_storage = @@document_storage_url + (@@convert_params % ['', '', '', '', document_revision_id, validate_key])

      if content_type == nil
        content_type = 'application/octet-stream'
      end

      uri = URI.parse(url_to_storage)
      http = Net::HTTP.new(uri.host, uri.port)

      if url_to_storage.start_with?('https')
        http.use_ssl = true
        http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      end

      req = Net::HTTP::Post.new(uri.request_uri, {'Content-Type' => content_type , 'Content-Length' => content_length.to_s })
      req.body = content
      res = http.request(req)
      data = res.body

      if data == nil
        raise 'Could not get an answer'
      end

      document_response = Hash.from_xml(data.gsub('\n', ''))
      percent, external_uri = get_response_uri(document_response)

      external_uri

    end

    def generate_revision_id(expected_key)

      require 'zlib'

      if expected_key.length > 20
        expected_key = (Zlib.crc32 expected_key).to_s
      end

      key = expected_key.gsub(/[^0-9a-zA-Z.=]/, '_')
      key[(key.length - [key.length, 20].min)..key.length]

    end

    def generate_validate_key(document_revision_id, user_ip)

      if document_revision_id == nil
        return ''
      end

      expire = Time.now.to_i * 1000
      key = generate_revision_id(document_revision_id)
      key_id = get_key
      user_count = '0'
      ip = user_ip != nil ? '' : user_ip

      key = '{"expire": "\/Date(%s)\/", "key" : "%s", "key_id" : "%s", "user_count" : %s, "ip" : "%s"}' %
            [expire.to_s, key.to_s, key_id.to_s, user_count, ip]

      Signature.create(key, get_skey)

    end

    def get_key

      Rails.configuration.tenantId

    end

    def get_skey

      Rails.configuration.key

    end

    def send_request_to_convert_service(document_uri, from_ext, to_ext, document_revision_id, is_async)

      from_ext = from_ext == nil ? File.extname(document_uri) : from_ext

      title = File.basename(URI.parse(document_uri).path)
      title = title == nil ? UUID.generate.to_s : title

      document_revision_id = document_revision_id.empty? ? document_uri : document_revision_id
      document_revision_id = generate_revision_id(document_revision_id)

      validate_key = generate_validate_key(document_revision_id, nil)

      url_to_converter = @@document_converter_url +
          (@@convert_params % [URI::encode(document_uri), to_ext.delete('.'), from_ext.delete('.'), title, document_revision_id, validate_key])

      if is_async
        url_to_converter += '&async=true'
      end

      data = nil
      count_try = 0

      while count_try < @@max_try
            begin
              count_try += 1

              uri = URI.parse(url_to_converter)
              http = Net::HTTP.new(uri.host, uri.port)

              if url_to_converter.start_with?('https')
                http.use_ssl = true
                http.verify_mode = OpenSSL::SSL::VERIFY_NONE
              end

              http.read_timeout = @@convert_timeout
              req = Net::HTTP::Get.new(uri.request_uri)
              res = http.request(req)
              data = res.body

              break
            rescue TimeoutError
              #try again
            rescue => ex
              raise ex.message
            end
      end

      if count_try == @@max_try && data == nil
        raise 'timeout'
      end

      Hash.from_xml(data.gsub('\n', ''))

    end

    def process_convert_service_responce_error(error_code)

      error_message = 'unknown error'

      case error_code
        when -8
          error_message = 'Error occurred in the ConvertService.ashx: Error document VKey'
        when -7
          error_message = 'Error occurred in the ConvertService.ashx: Error document request'
        when -6
          error_message = 'Error occurred in the ConvertService.ashx: Error database'
        when -5
          error_message = 'Error occurred in the ConvertService.ashx: Error unexpected guid'
        when -4
          error_message = 'Error occurred in the ConvertService.ashx: Error download error'
        when -3
          error_message = 'Error occurred in the ConvertService.ashx: Error convertation error'
        when -2
          error_message = 'Error occurred in the ConvertService.ashx: Error convertation timeout'
        when -1
          error_message = 'Error occurred in the ConvertService.ashx: Error convertation unknown'
        when 0
          #public const int c_nErrorNo = 0
        else
          error_message = 'ErrorCode = ' + error_code.to_s
      end

      raise error_message

    end

    def get_response_uri(document_response)

      file_result = document_response['FileResult']
      if file_result == nil
        raise 'Invalid answer format'
      end

      error_element = file_result['Error']
      if error_element != nil
        process_convert_service_responce_error(error_element.to_i)
      end

      end_convert_element = file_result['EndConvert']
      if end_convert_element == nil
        raise 'Invalid answer format'
      end
      is_end_convert = end_convert_element.downcase == 'true'

      result_percent = 0
      response_uri = ''

      if is_end_convert

        file_url_element = file_result['FileUrl']

        if file_url_element == nil
          raise 'Invalid answer format'
        end

        response_uri = file_url_element
        result_percent = 100

      else

        percent_element = file_result['Percent']

        if percent_element != nil
          result_percent = percent_element.to_i
        end

        result_percent = result_percent >= 100 ? 99 : result_percent

      end

      return result_percent, response_uri
    end

  end

end