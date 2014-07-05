# Get the directory that this configuration file exists in
dir = File.dirname(__FILE__)

# Load the sencha-touch framework automatically.
load File.join(dir, '..', 'themes')

# Compass configurations
sass_path    = dir
css_path     = File.join(dir, "..", "css-debug")
environment  = :development
output_style = :expanded