lib_LIBRARIES=libparsers.a
libparsers_a_SOURCES=firstparser.cxx htmlparser.cxx \
		      latexparser.cxx  manparser.cxx \
		      textparser.cxx 

noinst_PROGRAMS=testparser
testparser_SOURCES=firstparser.cxx firstparser.hxx htmlparser.cxx htmlparser.hxx latexparser.cxx latexparser.hxx manparser.cxx manparser.hxx testparser.cxx textparser.cxx textparser.hxx

# need mystrdup()
LDADD = ../hunspell/libhunspell-1.3.la
