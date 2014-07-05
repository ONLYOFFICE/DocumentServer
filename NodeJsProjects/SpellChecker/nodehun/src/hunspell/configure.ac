#                                               -*- Autoconf -*-
# Process this file with autoconf to produce a configure script.

m4_pattern_allow

AC_PREREQ(2.59)
AC_INIT([hunspell],[1.3.2],[nemeth@numbertext.org])

AC_CANONICAL_SYSTEM
AC_SUBST(XFAILED)

AM_INIT_AUTOMAKE(hunspell, 1.3.2)
HUNSPELL_VERSION_MAJOR=`echo $VERSION | cut -d"." -f1`
HUNSPELL_VERSION_MINOR=`echo $VERSION | cut -d"." -f2`
AC_SUBST(HUNSPELL_VERSION_MAJOR)
AC_SUBST(HUNSPELL_VERSION_MINOR)

AC_CONFIG_SRCDIR([config.h.in])
AC_CONFIG_HEADER([config.h])

# Checks for programs.
AC_PROG_CXX
AC_PROG_CC
AC_PROG_LIBTOOL
AC_LIBTOOL_WIN32_DLL

# Checks for libraries.

# Checks for header files.

AC_CHECK_HEADERS([fcntl.h libintl.h locale.h unistd.h error.h])

# Checks for typedefs, structures, and compiler characteristics.
AC_C_CONST
AC_C_INLINE

# Checks for library functions.
AC_FUNC_ERROR_AT_LINE
AC_HEADER_STDC
AC_CHECK_FUNCS([memchr setlocale strchr strstr])

dnl internationalization macros
AM_GNU_GETTEXT
AM_GNU_GETTEXT_VERSION(0.17)

AC_ARG_WITH(warnings,[  --with-warnings         compile with warning messages], [
     AC_DEFINE(HUNSPELL_WARNING_ON,1,"Define if you need warning messages")
])

AC_ARG_WITH(experimental,[  --with-experimental     compile with some extra functions], [
     AC_DEFINE(HUNSPELL_EXPERIMENTAL,1,"Define if you use exterimental functions")
])

CURSESLIB=""
AC_ARG_WITH(
   [ui],
   [AS_HELP_STRING([--with-ui],[support Curses user interface])],
   [],
   [with_ui=no]
)
AS_IF(
   [test "x$with_ui" != xno],
   [AC_CHECK_LIB(ncursesw,tparm,CURSESLIB=-lncursesw,
     AC_CHECK_LIB(curses,tparm,CURSESLIB=-lcurses,
       AC_CHECK_LIB(ncurses,tparm,CURSESLIB=-lncurses)))
   if test "$CURSESLIB" != "" ; then
     echo Compiling with curses user interface.
     AC_DEFINE(HAVE_CURSES_H,1,"Define if you have the <curses.h> header")
     if test "$CURSESLIB" != "-lncursesw" ; then
       echo "No Unicode support on interactive console. (Install Ncursesw library.)"
     else
       AC_DEFINE(HAVE_NCURSESW_H,1,"Define if you have the <ncursesw/curses.h> header")       
     fi
     AC_DEFINE(HUNSPELL_WARNING_ON,1,"Define if you need warning messages")
   fi]
)
AC_SUBST(CURSESLIB)

AC_ARG_WITH(
   [readline],
   [AS_HELP_STRING([--with-readline],[support fancy command input editing])],
   [],
   [with_readline=no]
)
rl=n
AS_IF([test "x$with_readline" != xno],
   [AC_CHECK_LIB(curses,tparm,TERMLIB=-lncurses,
     AC_CHECK_LIB(termcap,tgetent,TERMLIB=-ltermcap))
   LDSAVE=$LDFLAGS
   LDFLAGS="$LDFLAGS $TERMLIB"
   AC_CHECK_LIB(readline,readline,
      [AC_CHECK_HEADER(readline/readline.h,
      READLINELIB="-lreadline $TERMLIB";rl=y)],
      READLINELIB="")
   if test "$rl" = "y" ; then
     echo Using the readline library.
     AC_DEFINE(HAVE_READLINE,1,"Define if you have fancy command input editing with Readline")
   fi
   LDFLAGS=$LDSAVE]
)
AC_SUBST(READLINELIB)

AC_CONFIG_FILES([Makefile
		 hunspell.pc
                 man/Makefile
                 man/hu/Makefile
                 intl/Makefile
                 po/Makefile.in
                 m4/Makefile
		 src/Makefile
		 src/hunspell/Makefile
		 src/hunspell/hunvisapi.h
		 src/parsers/Makefile
		 src/tools/Makefile
		 src/win_api/Makefile
                 tests/Makefile
                 tests/suggestiontest/Makefile])
AC_OUTPUT
