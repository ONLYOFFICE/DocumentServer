# Get the directory that this configuration file exists in
dir = File.dirname(__FILE__)

# Load the sencha-touch framework automatically.
load File.join(dir, '..', '..', '..', '..', '..', 'vendor', 'touch', 'resources', 'themes')

# Add include path for command styles
add_import_path File.join(dir, '..', '..', '..', '..', '..', 'apps', 'common', 'mobile', 'resources', 'sass')

# Compass configurations
sass_path    = dir
css_path     = File.join(dir, "..", "css")
environment  = :production
output_style = :compressed