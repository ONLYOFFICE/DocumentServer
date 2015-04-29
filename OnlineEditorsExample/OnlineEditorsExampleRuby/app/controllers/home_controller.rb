class HomeController < ApplicationController
  def index
  end

  def editor

    DocumentHelper.init(request.remote_ip, request.base_url)

    @file = FileModel.new(:file_name => params[:fileName], :mode => params[:mode], :user_ip => request.remote_ip)

  end

  def sample

    DocumentHelper.init(request.remote_ip, request.base_url)

    file_name = DocumentHelper.create_demo(params[:fileExt])
    redirect_to :controller => 'home', :action => 'editor', :fileName => file_name

  end

  def upload

    DocumentHelper.init(request.remote_ip, request.base_url)

    begin
      http_posted_file = params[:file]
      file_name = http_posted_file.original_filename
      cur_size = http_posted_file.size

      if DocumentHelper.file_size_max < cur_size || cur_size <= 0
        raise 'File size is incorrect'
      end

      cur_ext = File.extname(file_name).downcase

      unless DocumentHelper.file_exts.include? cur_ext
        raise 'File type is not supported'
      end

      file_name = DocumentHelper.get_correct_name(file_name)

      File.open(DocumentHelper.storage_path(file_name, nil), 'wb') do |file|
        file.write(http_posted_file.read)
      end

      render :text =>  '{ "filename": "' + file_name + '"}'
    rescue => ex
      render :text =>  '{ "error": "' + ex.message + '"}'
    end

  end

  def convert

    begin
      file_name = params[:filename]
      file_uri = DocumentHelper.get_file_uri(file_name)
      extension = File.extname(file_name)
      internal_extension = DocumentHelper.get_internal_extension(FileUtility.get_file_type(file_name))

      if DocumentHelper.convert_exts.include? (extension)
        key = ServiceConverter.generate_revision_id(file_uri)
        percent, new_file_uri  = ServiceConverter.get_converted_uri(file_uri, extension.delete('.'), internal_extension.delete('.'), key, true)

        if percent != 100
          render :text => '{ "step" : "' + percent.to_s + '", "filename" : "' + file_name + '"}'
          return
        end

        correct_name = DocumentHelper.get_correct_name(File.basename(file_name, extension) + internal_extension)

        uri = URI.parse(new_file_uri)
        http = Net::HTTP.new(uri.host, uri.port)

        if new_file_uri.start_with?('https')
          http.use_ssl = true
          http.verify_mode = OpenSSL::SSL::VERIFY_NONE
        end

        req = Net::HTTP::Get.new(uri.request_uri)
        res = http.request(req)
        data = res.body

        if data == nil
          raise 'stream is null'
        end

        File.open(DocumentHelper.storage_path(correct_name, nil), 'wb') do |file|
          file.write(data)
        end

        file_name = correct_name
      end

      render :text => '{ "filename" : "' + file_name + '"}'
    rescue => ex
      render :text => '{ "error": "' + ex.message + '"}'
    end

  end

  def save

    download_uri = params[:fileuri]
    file_name = params[:filename]

    if download_uri == nil || file_name == nil || download_uri.empty? || file_name.empty?
      render :text => 'error'
      return
    end

    new_type = File.extname(download_uri).delete('.')
    current_type = (params[:filetype] == nil ? File.extname(file_name) : params[:filetype]).delete('.')

    if new_type.downcase != current_type.downcase

      key = ServiceConverter.generate_revision_id(download_uri)

      begin
          result, new_file_uri = ServiceConverter.get_converted_uri(download_uri, new_type, current_type, key, false)
          if result != 100
            raise 'error'
          end
      rescue
        render :text => 'error'
        return
      end

      download_uri = new_file_uri
      new_type = current_type

    end

    file_name = File.basename(file_name, current_type) + new_type

    begin

      uri = URI.parse(download_uri)
      http = Net::HTTP.new(uri.host, uri.port)

      if download_uri.start_with?('https')
        http.use_ssl = true
        http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      end

      req = Net::HTTP::Get.new(uri.request_uri)
      res = http.request(req)
      data = res.body

      if data == nil
        raise 'stream is null'
      end

      File.open(DocumentHelper.storage_path(file_name, nil), 'wb') do |file|
        file.write(data)
      end

    rescue
      render :text => 'error'
      return
    end

    render :text => 'success'

  end

  def track

    user_address = params[:userAddress]
    file_name = params[:fileName]

    storage_path = DocumentHelper.storage_path(file_name, user_address)
    body = request.body.read

    if body == nil || body.empty?
      return
    end

    file_data = JSON.parse(body)
    status = file_data['status'].to_i

    if status == 2 || status == 3 #MustSave, Corrupted

      saved = 1

      begin

        download_uri = file_data['url']
        uri = URI.parse(download_uri)
        http = Net::HTTP.new(uri.host, uri.port)

        if download_uri.start_with?('https')
          http.use_ssl = true
          http.verify_mode = OpenSSL::SSL::VERIFY_NONE
        end

        req = Net::HTTP::Get.new(uri.request_uri)
        res = http.request(req)
        data = res.body

        if data == nil
          raise 'stream is null'
        end

        File.open(storage_path, 'wb') do |file|
          file.write(data)
        end

      rescue
        saved = 0
      end

      render :text => '{"c":"saved","status":' + saved.to_s + '}'

    end

  end
end