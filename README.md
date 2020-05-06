# familyTreeViewer [![BCH compliance](https://bettercodehub.com/edge/badge/zackh105/familyTreeViewer?branch=master)](https://bettercodehub.com/)
familyTreeViewer is a simple web-based family tree viewer. 
It takes a [GEDCOM](https://www.familysearch.org/developers/docs/guides/gedcom) file as input, and returns a JavaScript-based site dynamically displaying the family tree and its details. 

# Usage
The GEDCOM file is parsed using `makeData.py`, found under `utils`. The default file path is `familyTree.ged` - however, different filenames can be passed using `--file`.

The Python script generates two JSON files, `structure.json` and `details.json`. 

* `structure.json` contains structural data - parents, children, spouses, sex, etc.
* `details.json` contains personal data - life events and pictures

## Viewing
Once the data is parsed and generated, the family tree can now be viewed interactivly at `index.html`. All necessary resources are contained within the `resources` folder, excluding the fonts and FontAwesome (hosted by Google and Cloudflare, respectively).

The site is static, which makes it ideal for hosting on a small, static website (maybe GitHub pages?). 

## Support
**Generally speaking**, this project supports most **modern** browsers, desktop and mobile. This means that IE11 is a strech at best, and any older IE versions are all but guaranteed not to work (if you want IE support, take it up with [Bill Gates](https://www.gatesnotes.com/)). 

# Example

![Example (English Monarcy)](https://i.imgur.com/mXuwDfL.png)
This example family tree was generated using a GEDCOM file of the [English and British Kings and Queens](https://chronoplexsoftware.com/myfamilytree/samples/).

For testing, two good sources are the [English Monarchy](https://chronoplexsoftware.com/myfamilytree/samples/) and the [Kennedy family](https://chronoplexsoftware.com/myfamilytree/samples/)


# Issues

Generally speaking, the majority of issues will stem from parser issues (at least in my tests). The GEDCOM files used were mainly generated using [GRAMPS](https://gramps-project.org/blog/). 

Note: I have yet to have any problems with GEDCOM files generated by GRAMPS. 

Even if a file is a valid GEDCOM file, maybe it won't work due to peculiarities in the generation - the empty case handling might be different (as it was with the English Monarchy example), formatting may differ, maybe the parser library just can't handle it. 

This project is intended for relatively straight-forward family trees. It can handle size (my personal one has 500+), and all the typical events - divorce, remarriage, multiple spouses, single parent, etc.

**However**, if the GEDCOM file has any specific peculiarities (for example, a Hapsburg-type family), it's pretty likely that this viewer won't display it properly. From an example, I know that intra-familial marriage doesn't render well, but that should be an edge case.


### Credits
* The image viewer was based off of [img_box](https://github.com/krittanon-w/IMG-BOX)
* The tree structure algorithm was helped by [this algorithm](https://rachel53461.wordpress.com/2014/04/20/algorithm-for-drawing-trees/)
* The tree generation was inspired by [this code](https://github.com/jepst/treeViewer)
