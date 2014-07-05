bin_PROGRAMS=analyze chmorph hunspell munch unmunch hzip hunzip

INCLUDES=-I${top_srcdir}/src/hunspell -I${top_srcdir}/src/parsers

hzip_SOURCES=hzip.c
hunzip_SOURCES=hunzip.cxx
hunzip_LDADD = ../hunspell/libhunspell-1.3.la

munch_SOURCES=munch.c munch.h
unmunch_SOURCES=unmunch.c unmunch.h

example_SOURCES=example.cxx
example_LDADD = ../hunspell/libhunspell-1.3.la

hunspell_SOURCES=hunspell.cxx
hunspell_LDADD = @LIBINTL@ @LIBICONV@ ../parsers/libparsers.a \
	../hunspell/libhunspell-1.3.la @CURSESLIB@ @READLINELIB@

analyze_SOURCES=analyze.cxx
analyze_LDADD = ../hunspell/libhunspell-1.3.la

chmorph_SOURCES=chmorph.cxx
chmorph_LDADD = ../parsers/libparsers.a ../hunspell/libhunspell-1.3.la

noinst_PROGRAMS=example

dist_bin_SCRIPTS=makealias affixcompress wordforms ispellaff2myspell wordlist2hunspell
