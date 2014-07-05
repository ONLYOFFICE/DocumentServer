{
  'targets': [
    {
      'target_name': 'nodehun',
      'sources': [
        'nodehun.cpp'
      ],
      'cflags': [ '-O3' ],
      'dependencies': [
        'hunspell/binding.gyp:hunspell',
      ],
    },
  ],
}
