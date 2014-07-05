#!/bin/awk -f
function translate(str) {
    while (sub(/&/, "#amp;", str) == 1);
    while (sub(/#amp;/, "\\&amp;", str) == 1); # fun isn't it ?
    while (sub(/</, "\\&lt;", str) == 1);
    while (sub(/>/, "\\&gt;", str) == 1);
    sub(/[0-9][0-9][0-9][0-9][0-9]+/, "<bug number='&'/>", str)
    return(str)
}
BEGIN         { 
		nb_entry = 0
                in_entry = 0
                in_item = 0
		print "<?xml version='1.0' encoding='ISO-8859-1'?>"
		print "<log>"
	      }
END           {
                if (in_item == 1)  printf("%s</item>\n", translate(item))
                if (in_entry == 1) print "  </entry>"
                print "</log>"
	      }
/^[ \t]*$/    { next }
/^[A-Za-z0-9]/ { 
                match($0, "\(.*\) \([A-Z]+\) \([0-9][0-9][0-9][0-9]\) \(.*\) <\(.*\)>", loge)
                if (in_item == 1)  printf("%s</item>\n", translate(item))
                if (in_entry == 1) print "  </entry>"
		nb_entry = nb_entry + 1
		if (nb_entry > 50) {
		    in_entry = 0
		    in_item = 0
		    exit
		}
                in_entry = 1
                in_item = 0
		printf("  <entry date='%s' timezone='%s' year='%s'\n         who='%s' email='%s'>\n", loge[1], loge[2], loge[3], loge[4], loge[5])
	      }
/^[ \t]*\*/   {
                if (in_item == 1)  printf("%s</item>\n", translate(item))
                in_item = 1
		printf("    <item>")
                match($0, "[ \t]*. *\(.*\)", loge)
		item = loge[1]
              }
/^[ \t]*[a-zA-Z0-9\#]/    { 
                if (in_item == 1) {
		    match($0, "[ \t]*\(.*\)[ \t]*", loge)
		    item = sprintf("%s %s",  item, loge[1])
		}
              }
