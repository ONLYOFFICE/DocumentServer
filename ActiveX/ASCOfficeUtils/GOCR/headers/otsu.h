/*

    see README for EMAIL-address

 */


/*======================================================================*/
/* OTSU global thresholding routine                                     */
/*   takes a 2D unsigned char array pointer, number of rows, and        */
/*   number of cols in the array. returns the value of the threshold    */
/*======================================================================*/
int
otsu (unsigned char *image, int rows, int cols, int x0, int y0, int dx, int dy, int vvv);


/*======================================================================*/
/* thresholding the image  (set threshold to 128+32=160=0xA0)           */
/*   now we have a fixed thresholdValue good to recognize on gray image */
/*   - so lower bits can used for other things (bad design?)            */
/*======================================================================*/
int
thresholding (unsigned char *image, int rows, int cols, int x0, int y0, int dx, int dy, int thresholdValue);
