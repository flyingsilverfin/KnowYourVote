# KnowYourVote
Joint project with Bella Olsson, for politically apathetic Australian voters


## Technical stuff


### Implemented features (newest first, as of October 2017)

* [_med_] Integration with MongoDB & OpenShift
* [_small_] publish/save working on admin interface
* [_tiny_] colorpicker defaults to non-white/transparent
* [_huge_] adding type schemas to restrict which data can be deleted and allowed values
    * type/structure JSON
    * allow generating valid structures directly from schema (fun!)
* [_large_] Admin interface for directly adding data

### In progress

-- currently taking a small break --

### Upcoming/missing features/bugfixes

* [_large_] put admin behind a secure layer requiring login
* [_med_] Undo button for admin interface
* [_med_] Properties re-order sometimes when renaming them (very annoying)
* [_large_?] Restrict allowed parties/subtopics to those defined?
    *  Either make schema system more sophisticated or just pop up warning if reference is undefined (would also be generalized by extending schema...)
* [_large_] New UI!
    *  Material-UI-ey
* [_large_?] enable reload/direct access to non-homepages (typical react issue)
* [_small_] lowercase all keys so that parties can be mis-cased but still work as keys
* [_med_] Make image resource work!