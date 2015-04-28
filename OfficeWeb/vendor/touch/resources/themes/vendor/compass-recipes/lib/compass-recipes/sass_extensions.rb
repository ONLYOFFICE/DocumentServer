# -----------------------------------------------
# Sass implementation of the Noisy jquery plugin:
# https://github.com/DanielRapp/Noisy
# by @philippbosch
# https://gist.github.com/1021332
# -----------------------------------------------

module Sass::Script::Functions
 def background_noise(kwargs = {})
   opts = {}
   Sass::Util.map_hash({
       "intensity"  => [0..1,          "",   :Number, Sass::Script::Number.new(0.5) ],
       "opacity"    => [0..1,          "",   :Number, Sass::Script::Number.new(0.08)],
       "size"       => [1..512,        "px", :Number, Sass::Script::Number.new(200) ],
       "monochrome" => [[true, false], "",   :Bool,   Sass::Script::Bool.new(false) ]
     }) do |name, (range, units, type, default)|

     if val = kwargs.delete(name)
       assert_type val, type, name
       if range && !range.include?(val.value)
         raise ArgumentError.new("$#{name}: Amount #{val} must be between #{range.first}#{units} and #{range.last}#{units}")
       end
     else
       val = default
     end
     opts[name] = val
   end

   image = ChunkyPNG::Image.new(opts["size"].to_i, opts["size"].to_i)

   for i in (0..(opts["intensity"].to_s.to_f * (opts["size"].to_i**2)))
      x = rand(opts["size"].to_i)
      y = rand(opts["size"].to_i)
      r = rand(255)
      a = rand(255 * opts["opacity"].to_s.to_f)
      color = opts["monochrome"] ? ChunkyPNG::Color.rgba(r, r, r, a) : ChunkyPNG::Color.rgba(r, rand(255), rand(255), a)
      image.set_pixel(x, y, color)
   end

   data = Base64.encode64(image.to_blob).gsub("\n", "")
   Sass::Script::String.new("url('data:image/png;base64,#{data}')")
 end
 declare :background_noise, [], :var_kwargs => true
end
