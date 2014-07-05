require "compass"

# for background_noise
require "chunky_png"
require "base64"
require File.join(File.dirname(__FILE__), 'compass-recipes', 'sass_extensions')

Compass::Frameworks.register("recipes", :path => "#{File.dirname(__FILE__)}/..")