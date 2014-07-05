/* unmunch header file */

#define MAX_LN_LEN    200
#define MAX_WD_LEN    200
#define MAX_PREFIXES  256
#define MAX_SUFFIXES  256
#define MAX_WORDS     500000
 
#define ROTATE_LEN      5
 
#define ROTATE(v,q) \
   (v) = ((v) << (q)) | (((v) >> (32 - q)) & ((1 << (q))-1));

#define SET_SIZE      256

#define XPRODUCT  (1 << 0)

/* the affix table entry */

struct affent
{
    char *  appnd;
    char *  strip;
    short   appndl;
    short   stripl;
    char    achar;
    char    xpflg;   
    short   numconds;
    char    conds[SET_SIZE];
};


struct affixptr
{
    struct affent * aep;
    int		    num;
};

/* the prefix and suffix table */
int	numpfx;		/* Number of prefixes in table */
int     numsfx;		/* Number of suffixes in table */

/* the prefix table */
struct affixptr          ptable[MAX_PREFIXES];

/* the suffix table */
struct affixptr          stable[MAX_SUFFIXES];

int    fullstrip;


int    numwords;	          /* number of words found */
struct dwords
{
  char * word;
  int pallow;
};

struct dwords  wlist[MAX_WORDS]; /* list words found */


/* the routines */

int parse_aff_file(FILE* afflst);

void encodeit(struct affent * ptr, char * cs);

int expand_rootword(const char *, int, const char*, int);

void pfx_add (const char * word, int len, struct affent* ep, int num);

void suf_add (const char * word, int len, struct affent * ep, int num);

char * mystrsep(char ** stringp, const char delim);

char * mystrdup(const char * s);

void mychomp(char * s);
