class Signature

  class << self

    def create(key, secret)

      #secret = '_ContactUs_'
      #key = '{"expire":"\/Date(1422449303583)\/","key":"mo.docx1422449303571","key_id":"_ContactUs_","user_count":0}'

      payload = get_hash_base64(key + secret) + '?' + key
      encode = url_token_encode(payload)

    end

    def get_hash_base64(str)

      utf8 = str.encode('utf-8')
      sha256 = Digest::SHA256.digest(utf8)
      base64 = Base64.strict_encode64(sha256)

    end

    def url_token_encode(str)

      utf8 = str.encode('utf-8')
      base64 = Base64.strict_encode64(utf8)

      cnt = 0
      base64.each_char {|c|
        if c == '='
          cnt += 1
        end
      }

      signature = base64.gsub('=', '') + cnt.to_s
      signature = signature.gsub('+', '-').gsub('/', '_')
      signature = URI.encode(signature)

    end

  end

end