#ifndef CPDOCCORE_BOOST_FILESYSTEM_VERSION_
#define CPDOCCORE_BOOST_FILESYSTEM_VERSION_

#include <boost/filesystem.hpp>

#if (BOOST_FILESYSTEM_VERSION == 2 || !defined(BOOST_FILESYSTEM_VERSION))
#define BOOST_FILESYSTEM_LEGACY
#define BOOST_STRING_PATH(A) (A).string()
#else
#undef BOOST_FILESYSTEM_LEGACY
#define BOOST_STRING_PATH(A) (A).string<std::wstring>()
#endif


#endif
