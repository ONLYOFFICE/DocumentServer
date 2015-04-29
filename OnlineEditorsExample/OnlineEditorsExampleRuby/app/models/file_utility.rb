class FileUtility

  @@exts_document = %w(.docx .doc .odt .rtf .txt .html .htm .mht .pdf .djvu .fb2 .epub .xps)

  @@exts_spreadsheet = %w(.xls .xlsx .ods .csv)

  @@exts_presentation = %w(.ppt .pptx .odp)

  class << self

    def get_file_type(file_name)
        ext = File.extname(file_name)

        if @@exts_document.include? ext
          return 'text'
        end

        if @@exts_spreadsheet.include? ext
          return 'spreadsheet'
        end

        if @@exts_presentation.include? ext
          return 'presentation'
        end

        'text'
    end

  end

end