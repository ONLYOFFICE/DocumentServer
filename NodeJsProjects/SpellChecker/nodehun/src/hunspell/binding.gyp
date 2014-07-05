{
  'target_defaults': {
    'default_configuration': 'Debug',
    'configurations': {
      'Debug': {
        'defines': [ 'DEBUG', '_DEBUG' ],
        'msvs_settings': {
          'VCCLCompilerTool': {
            'RuntimeLibrary': 1, # static debug
          },
        },
      },
      'Release': {
        'defines': [ 'NDEBUG' ],
        'msvs_settings': {
          'VCCLCompilerTool': {
            'RuntimeLibrary': 0, # static release
          },
        },
      }
    },
    'msvs_settings': {
      'VCCLCompilerTool': {
      },
      'VCLibrarianTool': {
      },
      'VCLinkerTool': {
        'GenerateDebugInformation': 'true',
      },
    },
    'conditions': [
      ['OS == "win"', {
        'defines': [
          'WIN32'
        ],
      }]
    ],
  },

  'targets': [
    {
      'target_name': 'hunspell',
      'type': 'static_library',
      'include_dirs': [ 'src/hunspell' ],
      'defines': [ 'HUNSPELL_STATIC' ],
      'direct_dependent_settings': {
        'include_dirs': [ 'src/hunspell' ],
        'defines': [ 'HUNSPELL_STATIC' ],
      },
      'cflags': [ '-O3' ],
      'sources': [
        'src/hunspell/affentry.cxx',
        'src/hunspell/affentry.hxx',
        'src/hunspell/affixmgr.cxx',
        'src/hunspell/affixmgr.hxx',
        'src/hunspell/atypes.hxx',
        'src/hunspell/baseaffix.hxx',
        'src/hunspell/csutil.cxx',
        'src/hunspell/csutil.hxx',
        'src/hunspell/dictmgr.cxx',
        'src/hunspell/dictmgr.hxx',
        'src/hunspell/filemgr.cxx',
        'src/hunspell/filemgr.hxx',
        'src/hunspell/hashmgr.cxx',
        'src/hunspell/hashmgr.hxx',
        'src/hunspell/htypes.hxx',
        'src/hunspell/hunspell.cxx',
        'src/hunspell/hunspell.hxx',
        'src/hunspell/hunzip.cxx',
        'src/hunspell/hunzip.hxx',
	'src/hunspell/istrmgr.hxx',
        'src/hunspell/langnum.hxx',
        'src/hunspell/phonet.cxx',
        'src/hunspell/phonet.hxx',
        'src/hunspell/replist.cxx',
        'src/hunspell/replist.hxx',
	'src/hunspell/strmgr.cxx',
	'src/hunspell/strmgr.hxx',
        'src/hunspell/suggestmgr.cxx',
        'src/hunspell/suggestmgr.hxx',
        'src/hunspell/w_char.hxx',
      ],
      'conditions': [
        ['OS=="win"', {
          'include_dirs': [ 'src/win_api' ],
          'sources': [
            'src/win_api/config.h',
          ],
        }, {
          'sources': [
            'src/hunspell/config.h',
          ],
        }],
      ],
    },
  ]
}
