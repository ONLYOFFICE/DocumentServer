class FileModel

  attr_accessor :file_name, :mode, :user_ip

  def initialize(attributes = {})
    @file_name = attributes[:file_name]
    @mode = attributes[:mode]
    @user_ip = attributes[:user_ip]
  end

  def desktop_type
    @mode != 'embedded'
  end

  def file_ext
    File.extname(@file_name)
  end

  def file_uri
    DocumentHelper.get_file_uri(@file_name)
  end

  def document_type
    FileUtility.get_file_type(@file_name)
  end

  def key
    uri = DocumentHelper.cur_user_host_address(nil) + '/' + @file_name
    ServiceConverter.generate_revision_id(uri)
  end

  def validate_key
    ServiceConverter.generate_validate_key(key, @user_ip)
  end

  def callback_url
    DocumentHelper.get_callback(@file_name)
  end

end