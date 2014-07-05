#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "hunzip.hxx"

#define DESC "hunzip - decompress a hzip file to the standard output\n" \
"Usage: hunzip file.hz [password]\n"

int fail(const char * err, const char * par) {
    fprintf(stderr, err, par);
    return 1;
}

int main(int argc, char** argv) {
    Hunzip * h;
    const char * s;
    if (argc == 1 || strcmp(argv[1], "-h") == 0) return fail(DESC, NULL);
    h = new Hunzip(argv[1], (argc > 2) ? argv[2] : NULL);
    while (h && (s = h->getline())) printf("%s", s);
    return 0;
}
