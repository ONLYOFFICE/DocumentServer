##
# Compass Recipes
# Configuration files mainly used for tests
#
http_path = '/'
css_dir = '.'
sass_dir = '.'

line_comments = false
relative_assets = true

additional_import_paths = [
    './stylesheets',
    './tests'
]

# just for testing extension
require File.join(File.dirname(__FILE__), 'lib', 'compass-recipes')
