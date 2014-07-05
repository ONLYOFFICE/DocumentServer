;;; libxml-doc.el - look up libxml-symbols and start browser on documentation

;; Author: Felix Natter <fnatter@gmx.net>, Geert Kloosterman <geertk@ai.rug.nl>
;; Created: Jun 21 2000
;; Keywords: libxml documentation

;; This program is free software; you can redistribute it and/or
;; modify it under the terms of the GNU General Public License
;; as published by the Free Software Foundation; either version 2
;; of the License, or (at your option) any later version.
;; 
;; This program is distributed in the hope that it will be useful,
;; but WITHOUT ANY WARRANTY; without even the implied warranty of
;; MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
;; GNU General Public License for more details.
;; 
;; You should have received a copy of the GNU General Public License
;; along with this program; if not, write to the Free Software
;; Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.

 ;;; Commentary / README

;; these functions allow you to browse the libxml documentation
;; (using lynx within emacs by default)
;;
;; ----- Installing
;; 1. add the following to ~/.emacs (adapt path and remove comments !)
;; (autoload 'libxmldoc-lookup-symbol "~/elisp/libxml-doc" 
;;  "Look up libxml-symbols and start browser on documentation." t)
;; or put this file in load-path and use this:
;; (autoload 'libxmldoc-lookup-symbol "libxml-doc"
;;  "Look up libxml-symbols and start browser on documentation." t)
;;
;; 2. adapt libxmldoc-root:
;; i.e. (setq libxmldoc-root "~/libxml2-2.0.0/doc/html")
;;
;; 3. change the filter-regex: by default, cpp-defines, callbacks and
;; html-functions are excluded (C-h v libxmldoc-filter-regexp)
;;
;; 4. consider customizing libxmldoc-browse-url (lynx by default);
;; cannot use Emacs/W3 4.0pre46 because it has problems with the html
;;
;; ----- Using
;; call M-x libxmldoc-lookup-symbol: this will prompt with completion and
;; then open the browser showing the documentation. If the word around the
;; point matches a symbol, that is used instead.  You can also call
;; libxmldoc-lookup-symbol noninteractively and pass the symbol.

;; Note:
;; an alternative to libxml-doc is emacs tags:
;; $ cd libxml2-2.3.8
;; $ make TAGS
;; $ emacs
;; M-. (M-x find-tag) ...  or
;; M-x tags-search ... RET M-, M-, ...
;; (for more information: info emacs RET m Tags RET)


 ;;; ChangeLog:
;; Wed Jun 21 01:07:12 2000: initial release
;; Wed Jun 21 01:45:29 2000: added libxmldoc-lookup-symbol-at-point
;; Wed Jun 21 23:37:58 2000: libxmldoc-lookup-symbol now uses
;; (thing-at-point 'word) if it matches a symbol
;; Thu Jun 22 02:37:46 2000: filtering is only done for completion
;; Thu Jun 22 21:03:41 2000: libxmldoc-browse-url can be customized
;; Thu May 31 2001 (Geert): 
;;       - Changed the `gnome-xml-' html file prefix into `libxml-'.
;;       - Changed the 'word match from thing-at-point into 'symbol.
;;         With 'word, identifiers with an underscore (e.g. BAD_CAST)
;;         don't get matched.
;; Fri Jun  8 16:29:18 2001, Sat Jun 23 16:19:47 2001:
;; complete rewrite of libxmldoc-lookup-symbol
;; by Felix Natter <fnatter@gmx.net>, Geert Kloosterman <geertk@ai.rug.nl>:
;;       - Now keeps the list of symbols between calls to speed things up.
;;       - filtering is only used when no symbol is passed and
;;       thing-at-point does not match a symbol and "*" + thing-at-point
;;       does not match a symbol (this is used to catch callbacks) and
;;       libxmldoc-filter-regexp is non-nil.
;; Sat Jun 23 16:20:34 2001: update the docstrings
;; Sat Jun 23 16:22:54 2001 (Geert Kloosterman <geertk@ai.rug.nl>):
;; update README: use autoload instead of load+c-mode-hook
;; Sat Jul 7 19:00:31 2001: fixed a problem with XEmacs: the
;; string-match of XEmacs when used in completing-read used the
;; minibuffer's value of case-fold-search, and not the one in the
;; c-mode buffer that we had set => so there's a new *-string-match-cs
;; (case sensitive) function which binds case-fold-search and runs string-match
;; Wed Sep 1 20:26:29 2004: adapted for libxml2-2.6.9: handle
;; document-relative (#XXX) links

;;; TODO:
;; - use command-execute for libxmldoc-browse-url
;; - keep (match-string 1) in a variable (libxmldoc-get-list-of-symbols)
;;   (only if it improves performance)
;; - check the (require ..)-statements

 ;;; Code:

(require 'browse-url)
(require 'term)

(defvar libxmldoc-root "~/src/libxml2-2.3.8/doc/html"
  "The root-directory of the libxml2-documentation (~ will be expanded).")
(defvar libxmldoc-filter-regexp "^html\\|^\\*\\|^[A-Z_]+"
  "Symbols that match this regular expression will be excluded when doing
completion and no symbol is specified.
 For example:
   callbacks:     \"^\\\\*\" 
   cpp-defines:   \"[A-Z_]+\"
   xml-functions  \"^xml\"
   html-functions \"^html\"
   sax-functions  \".*SAX\"
By default, callbacks, cpp-defines and html* are excluded.
Set this to nil if you don't want filtering.")
(defvar libxmldoc-browse-url 'browse-url-lynx-emacs
  "Browser used for browsing documentation. Emacs/W3 4.0pre46 cannot handle
the html (and would be too slow), so lynx-emacs is used by default.")
(defvar libxmldoc-symbol-history nil
  "History for looking up libxml-symbols.")
(defvar libxmldoc-symbols nil 
  "The list of libxml-symbols.")

 ;;;; public functions

(defun libxmldoc-lookup-symbol(&optional symbol)
  "Look up xml-symbol." (interactive)
  ;; setting case-fold-search is now done in libxmldoc-string-match-cs

  ;; Build up a symbol list if necessary
  (if (null libxmldoc-symbols)
      (setq libxmldoc-symbols (libxmldoc-get-list-of-symbols)))
    
  (cond
   (symbol ;; symbol is specified as argument
    (if (not (assoc symbol libxmldoc-symbols))
        (setq symbol nil)))
   ((assoc (thing-at-point 'symbol) libxmldoc-symbols)
    (setq symbol (thing-at-point 'symbol)))
   ;; this is needed to catch callbacks
   ;; note: this could be rewritten to use (thing-at-point 'word)
   ((assoc (concat "*" (thing-at-point 'symbol)) libxmldoc-symbols)
    (setq symbol (concat "*" (thing-at-point 'symbol))))
   )

  ;; omit "" t) from call to completing-read for the sake of xemacs
  (setq symbol (completing-read 
                "Libxml: " libxmldoc-symbols
                (if (or symbol (null libxmldoc-filter-regexp))
                    nil
                  '(lambda(key,value)
                     (not (libxmldoc-string-match-cs libxmldoc-filter-regexp
                                                     (car key,value)))))
                t symbol
                'libxmldoc-symbol-history))
    
    
  ;; start browser
  (apply libxmldoc-browse-url 
         (list (cdr (assoc symbol libxmldoc-symbols)))))

;; (if (or symbol
;;         (null libxmldoc-filter-regexp))
;;     libxmldoc-symbols
;;   (mapcar
;;    '(lambda(key,value)
;;       (if (null (string-match 
;;                  libxmldoc-filter-regexp
;;                  (car key,value)))
;;           key,value))
;;    libxmldoc-symbols))


;;;; internal

(defun libxmldoc-string-match-cs(regexp str)
  "This is needed because string-match in XEmacs uses the current-
buffer's value of case-fold-search (different from GNU Emacs)."
  (let ((case-fold-search nil))
    (string-match regexp str)))

(defun libxmldoc-get-list-of-symbols()
  "Get the list of html-links in the libxml-documentation."
  (let ((files
         (directory-files
          libxmldoc-root t
          (concat "^" (if (file-exists-p (concat libxmldoc-root
                                                 "/libxml-parser.html"))
                          "libxml-"
                        "gnome-xml-")
                  ".*\\.html$") t))
        (symbols ())
        (case-fold-search t)
        (uri))
    (message "collecting libxml-symbols...")
    (while (car files)
      (message "processing %s" (car files))
      (with-temp-buffer
        (insert-file-contents (car files))
        (goto-char (point-min))
        (while (re-search-forward
                "<a[^>]*href[ \t\n]*=[ \t\n]*\"\\([^=>]*\\)\"[^>]*>" nil t nil)
          ;; is it a relative link (#XXX)?
          (if (char-equal (elt (match-string 1) 0) ?#)
              (setq uri (concat "file://" (car files) (match-string 1)))
            (setq uri (concat "file://" (expand-file-name libxmldoc-root)
                              "/" (match-string 1))))
          (if (not (re-search-forward "\\([^<]*\\)<" nil t nil))
              (error "regexp error while getting libxml-symbols.."))
          ;; this needs add-to-list because i.e. xmlChar appears often
          (if (not (string-equal "" (match-string 1)))
              (add-to-list 'symbols (cons (match-string 1) uri))))
        ;;  (setq symbols (cons (cons (match-string 1) uri) symbols)))
        )
      (setq files (cdr files)))
    symbols))

(provide 'libxmldoc)

;;; libxml-doc.el ends here

;;; Local Variables:
;;; indent-tabs-mode: nil
;;; End:
