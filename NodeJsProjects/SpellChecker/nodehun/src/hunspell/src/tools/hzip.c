/* hzip: file compression for sorted dictionaries with optional encryption,
 * algorithm: prefix-suffix encoding and 16-bit Huffman encoding */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define CODELEN  65536
#define BUFSIZE  65536
#define EXTENSION ".hz"

#define ESCAPE 31
#define MAGIC "hz0"
#define MAGIC_ENCRYPTED "hz1"

#define DESC "hzip - dictionary compression utility\n" \
"Usage: hzip [-h | -P password ] [file1 file2 ..]\n" \
"  -P password  encrypted compression\n" \
"  -h           display this help and exit\n"

enum { code_LEAF, code_TERM, code_NODE};

struct item {
    unsigned short word;
    int count;
    char type;
    struct item * left;
    struct item * right;
};

int fail(const char * err, const char * par) {
    fprintf(stderr, err, par);
    return 1;
}

void code2table(struct item * tree, char **table, char * code, int deep) {
    int first = 0;
    if (!code) {
        first = 1;
        code = malloc(CODELEN);
    }
    code[deep] = '1';
    if (tree->left) code2table(tree->left, table, code, deep + 1);
    if (tree->type != code_NODE) {
        int i = tree->word;
        code[deep] = '\0';
        if (tree->type == code_TERM) i = CODELEN; /* terminal code */
        table[i] = malloc(deep + 1);
	strcpy(table[i], code);
    }        
    code[deep] = '0';
    if (tree->right) code2table(tree->right, table, code, deep + 1);
    if (first) free(code);
}

struct item * newitem(int c, struct item * l, struct item * r, int t) {
    struct item * ni = (struct item *) malloc(sizeof(struct item));
    ni->type = t;
    ni->word = 0;
    ni->count = c;
    ni->left = l;
    ni->right = r;
    return ni;
}

/* return length of the freq array */
int get_freqdata(struct item *** dest, FILE * f, unsigned short * termword) {
    int freq[CODELEN];
    int i, j, k, n;
    union {
        char c[2];
        unsigned short word;
    } u;
    for (i = 0; i < CODELEN; i++) freq[i] = 0;
    while((j = getc(f)) != -1 && (k = getc(f)) != -1) {
        u.c[0] = j;
        u.c[1] = k;
        freq[u.word]++;
    }
    if (j != -1) {
        u.c[0] = 1;
        u.c[1] = j;
    } else {
        u.c[0] = 0;
        u.c[1] = 0;
    }

    *dest = (struct item **) malloc((CODELEN + 1) * sizeof(struct item *));
    if (!*dest) return -1;
    for (i = 0, n = 0; i < CODELEN; i++) if (freq[i]) {
       (*dest)[n] = newitem(freq[i], NULL, NULL, code_LEAF);
       (*dest)[n]->word = i;
       n++;
    }
    /* terminal sequence (also contains the last odd byte of the file) */
    (*dest)[n] = newitem(1, NULL, NULL, code_TERM);
    *termword = u.word;
    return n + 1;
}

void get_codetable(struct item **l, int n, char ** table) {
    int i;
    while (n > 1) {
        int min = 0;
        int mi2 = 1;
        for (i = 1; i < n; i++) {
            if (l[i]->count < l[min]->count) {
                mi2 = min;
                min = i;
            } else if (l[i]->count < l[mi2]->count) mi2 = i;        
        }
        l[min] = newitem(l[min]->count + l[mi2]->count, l[min], l[mi2], code_NODE);
        for (i = mi2 + 1; i < n; i++) l[i - 1] = l[i];
        n--;
    }
    code2table(l[0], table, NULL, 0);
}

int write_bits(FILE *f, char * bitbuf, int *bits, char * code) {
    while (*code) {
        int b = (*bits) % 8;
        if (!b) bitbuf[(*bits) / 8] = ((*code) - '0') << 7;
        else bitbuf[(*bits) / 8] |= (((*code) - '0') << (7 - b));
        (*bits)++;
        code++;
        if (*bits == BUFSIZE * 8) {
            if (BUFSIZE != fwrite(bitbuf, 1, BUFSIZE, f))
                return 1;
            *bits = 0;
        }
    }
    return 0;
}

int encode_file(char ** table, int n, FILE *f, FILE *f2, unsigned short tw, char * key) {
    char bitbuf[BUFSIZE];
    int i, bits = 0;
    unsigned char cl, ch;
    int cx[2];
    union {
        char c[2];
        unsigned short word;
    } u;
    char * enc = key;

    /* header and codes */
    fprintf(f2, "%s", (key ? MAGIC_ENCRYPTED : MAGIC)); /* 3-byte HEADER */
    cl = (unsigned char) (n & 0x00ff);
    ch = (unsigned char) (n >> 8);
    if (key) {
        unsigned char cs;
        for (cs = 0; *enc; enc++) cs ^= *enc;
        fprintf(f2, "%c", cs);  /* 1-byte check sum */
        enc = key;        
        ch ^= *enc;
        if ((*(++enc)) == '\0') enc = key;
        cl ^= *enc;
    }
    fprintf(f2, "%c%c", ch, cl);   /* upper and lower byte of record count */
    for (i = 0; i < BUFSIZE; i++) bitbuf[i] = '\0';
    for (i = 0; i < CODELEN + 1; i++) if (table[i]) {
        int nmemb;
        u.word = (unsigned short) i;
        if (i == CODELEN) u.word = tw;
        if (key) {
            if (*(++enc) == '\0') enc = key;
            u.c[0] ^= *enc;
            if (*(++enc) == '\0') enc = key;
            u.c[1] ^= *enc;
        }        
        fprintf(f2, "%c%c", u.c[0], u.c[1]); /* 2-character code id */
        bits = 0;
        if (write_bits(f2, bitbuf, &bits, table[i]) != 0)
            return 1;
        if (key) {
            if (*(++enc) == '\0') enc = key;            
            fprintf(f2, "%c", ((unsigned char) bits) ^ *enc);
            for (cl = 0; cl <= bits/8; cl++) {
                if (*(++enc) == '\0') enc = key;
                bitbuf[cl] ^= *enc;
            }
        } else
            fprintf(f2, "%c", (unsigned char) bits); /* 1-byte code length */
        nmemb = bits/8 + 1;
        if (fwrite(bitbuf, 1, bits/8 + 1, f2) != nmemb)   /* x-byte code */
            return 1;
    }

    /* file encoding */
    bits = 0;
    while((cx[0] = getc(f)) != -1 && (cx[1] = getc(f)) != -1) {
        u.c[0] = cx[0];
        u.c[1] = cx[1];
        if (write_bits(f2, bitbuf, &bits, table[u.word]) != 0)
            return 1;
    }
    /* terminal suffixes */
    if (write_bits(f2, bitbuf, &bits, table[CODELEN]) != 0)
        return 1;
    if (bits > 0)
    {
        int nmemb = bits/8 + 1;
        if (fwrite(bitbuf, 1, nmemb, f2) != nmemb)
            return 1;
    }
    return 0;
}

int prefixcompress(FILE *f, FILE *tempfile) {
    char buf[BUFSIZE];
    char buf2[BUFSIZE * 2];
    char prev[BUFSIZE];
    int prevlen = 0;
    while(fgets(buf,BUFSIZE,f)) {
        int i, j, k, m, c=0;
        int pfx = prevlen;
        char * p = buf2;
        m = j = 0;
        for (i = 0; buf[i]; i++) {
            if ((pfx > 0) && (buf[i] == prev[i])) {
                j++;
            } else pfx = 0;
        }
        if (i > 0 && buf[i - 1] == '\n') {
            if (j == i) j--; /* line duplicate */
            if (j > 29) j = 29;
            c = j;
            if (c == '\t') c = 30;
            /* common suffix */
            for (; buf[i - m - 2] == prev[prevlen - m - 2] && 
                m < i - j - 1 && m < 15; m++);
            if (m == 1) m = 0;
        } else {
            j = 0;
            m = -1;
        }
        for (k = j; k < i - m - 1; k++, p++) {
            if (((unsigned char) buf[k]) < 47 && buf[k] != '\t' && buf[k] != ' ') {
                *p = ESCAPE;
                p++;
            }
            *p = buf[k];
        }
        if (m > 0) {
            *p = m + 31; /* 33-46 */
            p++;
        }
        if (i > 0 && buf[i - 1] == '\n') {
            size_t nmemb = p - buf2 + 1;
            *p = c;
            if (fwrite(buf2, 1, nmemb, tempfile) != nmemb)
                return 1;
        } else {
            size_t nmemb = p - buf2;
            if (fwrite(buf2, 1, nmemb, tempfile) != nmemb)
                return 1;
        }
        memcpy(prev, buf, i);
        prevlen = i;
    }
    return 0;
}

int hzip(const char * filename, char * key) {
    struct item ** list;
    char * table[CODELEN + 1];
    int n;
    char out[BUFSIZE];
    FILE *f, *f2, *tempfile;
    unsigned short termword;
    strcpy(out, filename);
    strcat(out, EXTENSION);
    f = fopen(filename, "r");
    if (!f) return fail("hzip: %s: Permission denied\n", filename);
    tempfile = tmpfile();
    if (!tempfile) {
        fclose(f);
        return fail("hzip: cannot create temporary file\n", NULL);
    }
    f2 = fopen(out, "wb");
    if (!f2) {
        fclose(tempfile);
        fclose(f);
        return fail("hzip: %s: Permission denied\n", out);
    }
    for (n = 0; n < CODELEN; n++) table[n] = NULL;
    if (prefixcompress(f, tempfile) != 0) {
        fclose(f2);
        fclose(tempfile);
        fclose(f);
        return fail("hzip: cannot write file\n", NULL);
    }
    rewind(tempfile);
    n = get_freqdata(&list, tempfile, &termword);
    get_codetable(list, n, table);
    rewind(tempfile);
    n = encode_file(table, n, tempfile, f2, termword, key);
    fclose(f2);
    fclose(tempfile);
    fclose(f);
    if (n != 0) return fail("hzip: cannot write file\n", NULL);
    return n;
}

int main(int argc, char** argv) {

    int i, j = 0;
    char * key = NULL;
    for (i = 1; i < argc; i++) {
        if (*(argv[i]) == '-') {
            if (*(argv[i] + 1) == 'h')
                return fail(DESC, NULL);
            if (*(argv[i] + 1) == 'P') {
                if (i + 1 == argc)
                    return fail("hzip: missing password\n", NULL);
                key = argv[i + 1];
                i++;
                continue;
            }
            return fail("hzip: no such option: %s\n", argv[i]);
        } else if (hzip(argv[i], key) != 0) return 1; else j = 1;
    }
    if (j == 0) return fail("hzip: need a filename parameter\n", NULL);
    return 0;
}
