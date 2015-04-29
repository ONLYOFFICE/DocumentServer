require File.expand_path('../boot', __FILE__)

# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "sprockets/railtie"
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module OnlineEditorsExampleRuby
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    # Do not swallow errors in after_commit/after_rollback callbacks.
    config.active_record.raise_in_transactional_callbacks = true

    Rails.configuration.fileSizeMax=5242880
    Rails.configuration.storagePath="app_data"
    Rails.configuration.timeout=120

    Rails.configuration.tenantId="_ContactUs_"
    Rails.configuration.key="_ContactUs_"

    Rails.configuration.viewedDocs=".ppt|.pps|.odp|.pdf|.djvu|.fb2|.epub|.xps"
    Rails.configuration.editedDocs=".docx|.doc|.odt|.xlsx|.xls|.ods|.csv|.pptx|.ppsx|.rtf|.txt|.mht|.html|.htm"
    Rails.configuration.convertDocs=".doc|.odt|.xls|.ods|.ppt|.pps|.odp|.rtf|.mht|.html|.htm|.fb2|.epub"

    Rails.configuration.urlStorage="https://doc.onlyoffice.com/FileUploader.ashx"
    Rails.configuration.urlConverter="https://doc.onlyoffice.com/ConvertService.ashx"
    Rails.configuration.urlApi="https://doc.onlyoffice.com/OfficeWeb/apps/api/documents/api.js"
    Rails.configuration.urlPreloader="https://doc.onlyoffice.com/OfficeWeb/apps/api/documents/cache-scripts.html"

    Rails.configuration.haveExternalIp=false #service can access the document on the url

  end
end
