// Some formatting options
let scale = 1;
let baseVM = 50;
let baseHM = 20;
let baseBM = 5;
let verticalMargin = baseVM * scale;
let horizontalMargin = baseHM * scale;
let nodeBorderMargin = baseBM * scale;
const generationLimit = 6;
const mouseClickRadius = 70;
const xmlRTimeout = 20000;

let currentLanguage = "UA";
const languages = [
    {
        id: "UA", 
        name : "УКР",
        locatedIn: " в ",
        born: {"M": "Народився", "F": "Народилася"},
        died: {"M": "Помер", "F": "Померла"},
        parents: "Батьки",
        and: " і ",
        buried: {"M": "Похований", "F": "Похована"},
        occupation: "Праця",
        married: {"M": "Одружився з ", "F": "Вийшла за заміж з "},
        divorced: "Розлучились ",
        yearsOld: "років",
        yearsAgo: "років тому",
        // Relationship calculator
        samePerson: "Та сама людина",
        siblings: {"MM": "брати", "MF": "брат/сестра", 
        "FM": "сестра/брат", "FF": "сестри"},
        cousins: {"MM": "кузини", "MF": "кузини", "FM": "кузини",
        "FF": "кузинки"},
        child: {"M": "син", "F": "дочка"},
        parent: {"M": "батько", "F": "мама"},
        grandparent: {"M": "дідо", "F": "баба"},
        grandchild: {"M": "внук", "F": "внучка"},
        great: "пра",
        auntUncle: {"MM": "стрийко", "MF": "вуйко", "FM": "стриянка", "FF": "тета"},
        nieceNephew: {"MM": "братанець", "MF": "сестрінець", "FM": "братаниця", "FF": "сестріниця"},
        removed: "віддалені",
        relationshipCalculator: "Як ми споріднені?",
        person: "Людина ",
        noRelation: "не безпосередньо споріднені",
        are: " є ",
        months: ["січ.", "лют.", "бер.", "кві.", "тра.", "чер.", "лип.", "серп.", "вер.", "жов.", "лист.", "гру."], 
    },
    {
        id: "EN", 
        name: "ENG",
        locatedIn: " in ",
        born: {"M": "Born", "F": "Born"},
        died: {"M": "Died", "F": "Died"},
        parents: "Parents",
        and: " and ",
        buried: {"M": "Buried", "F": "Buried"},
        occupation: "Occupation",
        married: {"M": "Married ", "F": "Married "},
        divorced: "Divorced ",
        yearsOld: "years old",
        yearsAgo: "years ago",
        // Relationship calculator
        samePerson: "Same person",
        siblings: {"MM": "Brothers", "MF": "Brother/Sister", 
        "FM": "Sister/Brother", "FF": "Sisters"},
        cousins: {"MM": "cousins", "MF": "cousins", "FM": "cousins",
        "FF": "кузинки"},
        child: {"M": "son", "F": "daughter"},
        parent: {"M": "father", "F": "mother"},
        grandparent: {"M": "grandfather", "F": "grandmother"},
        grandchild: {"M": "grandson", "F": "granddaughter"},
        great: "great",
        auntUncle: {"MM": "uncle", "MF": "uncle", "FM": "aunt", "FF": "aunt"},
        nieceNephew: {"MM": "nephew", "MF": "nephew", "FM": "niece", "FF": "niece"},
        removed: "removed",
        relationshipCalculator: "Relationship Calculator",
        person: "Person ",
        noRelation: "not directly related",
        are: " are ",
        months: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
    },
];

function getLang() {
    for (let lang of languages) {
        if (lang["id"] == currentLanguage) {
            return lang;
        }
    }
    throw new Error(`Language ${currentLanguage} not found`);
}


// Trims whitespace
String.prototype.trim = function() {
	// Replaces any space characters at start, or at end
    return String(this).replace(/^\s+|\s+$/g, '');
}




// Updates the scaling
function updateScale(newScale: number) {
	scale = newScale;
	verticalMargin = baseVM * scale;
	horizontalMargin = baseHM * scale;
	nodeBorderMargin = baseBM * scale;
}


// Checks the visibility of an element
function isVisible(element: HTMLElement) {
    return element.offsetWidth > 0 || element.offsetHeight > 0;
}



// Only add an item to a list if it doesn't exist in the list
function addUnique(value: any, lst: any[]) {
    for (let elem of lst) {
        if (elem == value) {
            return;
        }
    }
    lst.push(value);
}




// Loads an image
function loadImage(source: string) {
    let image = new Image();
    image.src = source;
    return image
}


// Empties the given container element
function makeEmpty(container: HTMLElement) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }        
}


// Generates the info window with the following
function showInfoWindow(content: {[key: string]: any}) {
    let info = document.getElementById("textinfo") as HTMLElement;
    makeEmpty(info);

    info.appendChild(content["text"]);
    info.scrollTop = 0;

    fadeIn(document.getElementById("infowindow") as HTMLElement,
        0.05, "block");
}



// Gets the hash string
function getHashString() {
    let hash = window.location.hash;
    if (hash[0] == "#") {
        hash = hash.substr(1);
    }
    return decodeURIComponent(hash);
}

// Parses the name for display
function displayName(name: string) {
    return name.replace(/\//g,"");
}

// PArses only the first string
function displayFirstName(name: string) {
    return name.split("/")[0].trim();
}

// Parses the surname for display
function displaySurname(name: string) {
    let s = name.split("/", 2);
    return s.length == 2 ? s[1].trim() : "";
    // FOr some reason, this returned "" before in ALL CASES
}

function relationshipCalculator(person1: string, person2: string, data: any) {
    const langArray: any = getLang();

    const details = data["details"];
    // Finds the least common ancestor
    function leastCommonAncestor(p1: string, p2: string) {
        let ancestors1 = details[p1]["ancestors"];
        let ancestors2 = details[p2]["ancestors"];

        // We include the people themselves
        ancestors1.push([p1, 0]);
        ancestors2.push([p2, 0]);

        let commonAncestors = [];
        for (let i = 0; i < ancestors1.length; i++) {
            for (let j = 0; j < ancestors2.length; j++) {
                if (ancestors1[i][0] == ancestors2[j][0]) {
                    commonAncestors.push([ancestors1[i][0], ancestors1[i][1] + ancestors2[j][1]]);
                }
            }
        }
        
        // Sort by the generational spacing
        commonAncestors.sort(function(a, b){return a[1] - b[1]});

        return commonAncestors[0]
    }

    // Finds how far away the given ancestor is
    function findAncestorGap(person: string, ancestor: string) {
        for (let a of details[person]["ancestors"]) {
            if (a[0] == ancestor) {
                return a[1];
            }
        }
        return null;
    }

    // Parses the given number into the cousin number
    function parseCousinNumber(i: number) {
        if (currentLanguage == "UA") {
            return i.toString() + "і ";
        }
        else {
            let j = i % 10;
            let k = i % 100;
            if (j == 1 && k != 11) {
                return i + "st ";
            }
            if (j == 2 && k != 12) {
                return i + "nd ";
            }
            if (j == 3 && k != 13) {
                return i + "rd ";
            }
            return i + "th ";
        }
    }

    // Parses the given number into "times removed"
    function parseRemovedNumber(i: number) {
        if (currentLanguage == "UA") {
            if (i == 1) {
                return "1 раз ";
            }
            else {
                return i + " разів ";
            }
        }
        else {
            if (i == 1) {
                return "once ";
            }
            else if (i == 2) {
                return "twice ";
            }
            else {
                return i + " times ";
            }
        }
    }

    var lcm = leastCommonAncestor(person1, person2);

    if (lcm == null) {
        return langArray["noRelation"];
    }

    const generationA = findAncestorGap(person1, lcm[0]);
    const generationB = findAncestorGap(person2, lcm[0]);

    const sexA = data["structure"][person1]["sex"].toUpperCase();
    const sexB = data["structure"][person2]["sex"].toUpperCase();
    const sexes = sexA + sexB;

    // On the same level here
    if (generationA == generationB) {
        if (generationA == 0) {
            return langArray["samePerson"];
        }
        if (generationA == 1) {
            return langArray["siblings"][sexes];
        }
        if (generationA >= 2) {
            var number = parseCousinNumber(generationA-1);
            return number + langArray["cousins"][sexes];
        }

    }

    // We also need to find out what side the younger one is on
    function getSiblingAncestor(personOne: string, personTwo: string) {
        let parentsA = data["structure"][personOne]["parents"];
        let parentChildren;
        for (let parent of parentsA) {
            parentChildren = data["structure"][parent]["children"];
            if (parentChildren.includes(personOne)) {
                break;
            }
        }

        let rawAncestors = data["details"][personTwo]["ancestors"];
        let ancestors = [];
        for (let ra of rawAncestors) {
            ancestors.push(ra[0]);
        }


        for (var j = 0; j < parentChildren.length; j++) {
            if (ancestors.includes(parentChildren[j])) {
                return data["structure"][parentChildren[j]]["sex"].toUpperCase();
            }
        }
        return "F"; // Default fallback
    }

    // If person1 is less than person2 (ie. person1 is higher up)
    if (generationA < generationB) {
        if (generationA == 0) { 
            // B is a direct descendant of A
            if (generationB == 1) {
                return langArray["parent"][sexA] + "/" + langArray["child"][sexB];
            }
            else if (generationB == 2) {
                // grandchild
                return langArray["grandparent"][sexA] + "/" + langArray["grandchild"][sexB];
            }
            else {
                // great-grand
                var prefix = "";
                for (var i = generationB-2; i > 0; i--) {
                    prefix += langArray["great"] + "-";
                }
                return prefix + langArray["grandparent"][sexA] + "/" + prefix + langArray["grandchild"][sexB];
            }
        }

        else if (generationA == 1) {
            // B is a descendant of A's sibling
            // For Ukrainian: to determine стрійко vs. вуйко
            var parentsB = data["structure"][person2]["parents"];
            var parentSex = "F"; // Keep this as a default
            for (var i = 0; i < parentsB.length; i++) {
                var ancestorsB = []
                for (var j = 0; j < data["details"][parentsB[i]]["ancestors"].length; j++) {
                    ancestorsB.push(data["details"][parentsB[i]]["ancestors"][j][0]);
                }
                if (ancestorsB.includes(lcm[0])) {
                    // the ancestor is on this parent's side
                    parentSex = data["structure"][parentsB[i]]["sex"].toUpperCase();
                }
            }

            var siblingSex = getSiblingAncestor(person1, person2);

            if (generationB == 2) {
                // B is the child of A's sibling
                return langArray["auntUncle"][sexA + parentSex] + "/" + langArray["nieceNephew"][sexB + siblingSex];   
            }
            else {
                var prefix = "";
                for (var i = generationB-2; i > 0; i--) {
                    prefix += langArray["great"] + "-";
                }
                return prefix + langArray["auntUncle"][sexA + parentSex] + "/" + prefix + langArray["nieceNephew"][sexB + siblingSex];
            }
        }

        else {
            // General cousin case
            var number = parseCousinNumber(generationA-1);
            var removedNumber = parseRemovedNumber(generationB - generationA);
            var removed = ", " + removedNumber + langArray["removed"];
            return number + langArray["cousins"][sexes] + removed;
        }
    }

    // If person B is less than person A (basically the reverse of the above case)
    if (generationA > generationB) {
        if (generationB == 0) {
            // parent, grandparent, etc
            // Direct ancestor
            if (generationA == 1) {
                return langArray["child"][sexA] + "/" + langArray["parent"][sexB];
            }
            else if (generationA == 2) {
                // grandchild
                return langArray["grandchild"][sexA] + "/" + langArray["grandparent"][sexB];
            }
            else {
                // great-grand
                var prefix = "";
                for (var i = generationA-2; i > 0; i--) {
                    prefix += langArray["great"] + "-";
                }
                return prefix + langArray["grandchild"][sexA] + "/" + prefix + langArray["grandparent"][sexB];
            }
        }
        else if (generationB == 1) {
            // the sibling of a direct ancestor
            // For Ukrainian: to determine стрійко vs. вуйко
            var parentsA = data["structure"][person1]["parents"];
            var parentSex = "F"; // Keep this as a default
            for (var i = 0; i < parentsA.length; i++) {
                var ancestorsA = []
                for (var j = 0; j < data["details"][parentsA[i]]["ancestors"].length; j++) {
                    ancestorsA.push(data["details"][parentsA[i]]["ancestors"][j][0]);
                }
                if (ancestorsA.includes(lcm[0])) {
                    // the ancestor is on this parent's side
                    parentSex = data["structure"][parentsA[i]]["sex"].toUpperCase();
                }
            }
            var siblingSex = getSiblingAncestor(person1, person2);
            if (generationA == 2) {
                // Aunt/Uncle
                return langArray["nieceNephew"][sexA + siblingSex] + "/" + langArray["auntUncle"][sexB + parentSex];   
            }
            else {
                var prefix = "";
                for (var i = generationA-2; i > 0; i--) {
                    prefix += langArray["great"] + "-";
                }
                return prefix + langArray["nieceNephew"][sexA + siblingSex] + "/" + prefix + langArray["auntUncle"][sexB + parentSex];
            }
        }

        else {
            // General cousin case
            var number = parseCousinNumber(generationB-1);
            var removedNumber = parseRemovedNumber(generationA - generationB);
            var removed = ", " + removedNumber + langArray["removed"];
            return number + langArray["cousins"][sexes] + removed;
        }
    }
}



// Searches for the given person
function personSearch(data: any, view: any) {
    var rawStructure = data["structure_raw"];
    

    // Todo fix data src
    function generateUtils(dataSrc: any, titleName: string) {
        // generate index
        function makeIndex() {
            var divContainer = document.createElement('div');
            divContainer.className = "container";

            var leftDiv: null | HTMLElement = null;
            var previousItem = "";

            // Handle linking to the person
            function personLink(event: any) {
                view.setFocus(event.currentTarget["link_person_id"]);
            }

            // Handles a specific person
            function handle(i: any) {
                var newItem = dataSrc[i][1];
                var newRow = newItem != previousItem;

                // If we need to generate a new row
                if (newRow) {
                    var divRow = document.createElement('div');
                    var divClass = (styleNumber == 0) ? "detailRow" : "detailRow1";
                    styleNumber = (styleNumber == 0) ? 1 : 0; // Swap
                    divRow.className = divClass;

                    var divSurnames = document.createElement('div');
                    divSurnames.className = "rowDate";
                    divSurnames.appendChild(document.createTextNode(newItem));

                    leftDiv = document.createElement('div');
                    leftDiv.className = "rowContent";

                    divRow.appendChild(divSurnames);
                    divRow.appendChild(leftDiv);
                    divContainer.appendChild(divRow);
                }

                var name = document.createElement('div');

                if (!newRow) {
                    name.style.marginTop = "10px"; // Add a space between each name if not in a new row
                }

                var link: HTMLAnchorElement = document.createElement("a");
                link.style.cursor = "pointer";
                var person = data["structure"][dataSrc[i][0]];
                var personName = displayName(person["name"]);
                previousItem = newItem;

                link.appendChild(document.createTextNode(personName));
                (link as any)["link_person_id"] = dataSrc[i][0];
                link.addEventListener("click", personLink);
                name.appendChild(link);
                (leftDiv as HTMLElement).appendChild(name);
            }

            var styleNumber = 0;
            for (var i = 0; i < dataSrc.length; i++) {
                handle(i);
            }
            return divContainer;
        }

        var names = document.createElement('div');
        names.className ='detailTitleDiv';
        var container = document.createElement('div');
        container.appendChild(names);

        var name = document.createElement('div'); 
        name.className='detailTitle';
        names.appendChild(name);
        name.appendChild(document.createTextNode(titleName));

        var indexContent = document.createElement('div');
        indexContent.appendChild(makeIndex());
        container.appendChild(indexContent);

        showInfoWindow({"text": container});
    }

    // Index button
    (document.getElementById("indexbutton") as HTMLElement).onclick = function(_) {
        var namesArray = [];

        // Generate the names array first
        for (var j = 0; j < rawStructure.length; j++) {
            var surname = displaySurname(rawStructure[j]["name"]);
            var id = rawStructure[j]["id"];
            namesArray.push([id, surname]);
        }

        return generateUtils(namesArray, "Index/Індех");
    };

    // Birthdays button
    (document.getElementById("birthdaybutton") as HTMLElement).onclick = function(_) {
        return generateUtils(data["birthdays"], "Birthdays")
    };

    
    // Burial button
    (document.getElementById("burialbutton") as HTMLElement).onclick = function(_) {
        generateUtils(data["burials"], "Burials")
    };


    // HELP BUTTON
    (document.getElementById("helpbutton") as HTMLElement).onclick = function(_) {
    	showInfoWindow({"text": (document.getElementById("helpDivHidden") as HTMLElement).cloneNode(true)});
    };

    // Change the languages
    (document.getElementById("languagebutton") as HTMLElement).onclick = function(_) {
        let newIndex = 0;
        // Gets the next language
        for (var i = 0; i < languages.length; i++) {
            if (languages[i]["id"] == currentLanguage) {
                if (i + 1 < languages.length) {
                    newIndex = i + 1;
                }
                else {
                    newIndex = 0;
                }
            }
        }
        currentLanguage = languages[newIndex]["id"];

        // Update the button
        (document.getElementById("languagebutton") as HTMLElement).innerHTML = languages[newIndex]["name"];

        view.recreateTree(); // Redraw
    };


    // Zoom handling
    (document.getElementById("zoomin") as HTMLElement).onclick = function(_) {
        view.zoomIn();
    };
    (document.getElementById("zoomout") as HTMLElement).onclick = function(_) {
        view.zoomOut();
    };
 

    setSearchEvents(document.getElementById("searchtext") as HTMLInputElement,
        document.getElementById("searchlist") as HTMLInputElement, data, view);
}



// Executes a direct search (name must match person's name EXACTLY)
function executeSearch(name: string, rawStructure: PersonStructure[]) {
    return;

    // todo fix - view is not defined here (do i even want to fix this?)

    // var cleanName = name.toLowerCase().trim();
    //
    // if (cleanName == "") return; // Kill the empty case
    //
    // for (var i = 0; i < rawStructure.length; i++) {
    //     if (displayName(rawStructure[i]["name"]).toLowerCase() == cleanName) {
    //         // Only take direct matches
    //         view.setFocus(rawStructure[i]["id"]);
    //         return;
    //     }
    // }
    //
    // showError('"' + cleanName + '" could not be found in the tree (names must exactly match)');
}



// Sets all the events for any search bar
function setSearchEvents(searchText: HTMLInputElement, searchList: HTMLElement, data: any, view: any, link=true) {
    var rawStructure = data["structure_raw"];

    // On focus, we automatically select all existing text
    searchText.addEventListener("focus", 
        function(event){
            (event.currentTarget as HTMLInputElement).setSelectionRange(0,
                (event.currentTarget as HTMLInputElement).value.length);
    });

    // On enter, try searching
    searchText.addEventListener("keydown",
        function(keyEvent) {
            if (keyEvent.keyCode == 13) { // On enter
                executeSearch(searchText.value, rawStructure);
            }
    });

    // If we're not searching, we don't show the results list
    searchText.addEventListener("blur",
        function(event){ 
            searchList.style.display = "none"; // Hide when not in focus
    });

    // Event listener for each individual search result
    function searchResultEL(event: any) {
        searchText.value = displayName(data["structure"][event.currentTarget["data-search_id"]]["name"]);
        if (link) {
            view.setFocus(event.currentTarget["data-search_id"]);
        }
        return searchText.value;
    }

    // Clears the list of any children
    function clearList(lst: HTMLElement) {
        while (lst.firstChild) { // Empty the list and begin anew
            lst.removeChild(lst.firstChild); 
        }
    }

    // Checks if the names match
    function namesMatch(query: string[], name: string) {
        return query.some(q => !name.includes(q));
    }

    // SHows the result
    function showResult(person: PersonStructure) {
        var result = document.createElement('div');
        result.className = "searchresult";

        // add life dates (if we have any)
        var birth = person["birth"][0];
        var death = person["death"][0];
        var range = (birth || death) ? " (" + birth + "–" + death + ")" : "";


        result.textContent = displayName(person["name"]) + range;
        result.addEventListener("mousedown", searchResultEL);

        (result as any)["data-search_id"] = person["id"];

        return result;
    }

    searchText.addEventListener("input",
        function(event) {
            clearList(searchList);

            if (searchText.value.length < 3) return; // Don't start searching unless 3+ characters

            var splitText = searchText.value.toLowerCase().split(" ");
            var anyMatches = false;


            for (var i = 0; i < rawStructure.length; i++) {
                var match = namesMatch(splitText, displayName(rawStructure[i]["name"]).toLowerCase());


                if (match) {
                    // This filters out any duplicates from the search results
                    // (in the case of incest), since we duplicated the id's and added an integer after
                    // the "@". Any IDs with @XXXXX@X are not unique, and shouldn't be counted
                    if (rawStructure[i]["id"].endsWith("@")) {
                        anyMatches = true;
                        searchList.style.display = "block";
                        searchList.appendChild(showResult(rawStructure[i]));
                    }
                }
            }
            
            if (!anyMatches) {
                searchList.style.display="none";  
            }
    })
}


function dateToIso(dateStr: string) {
    let strArr = dateStr.split(" ");

    if (strArr.length < 3 || strArr.indexOf("ABT") != -1) {
        throw new Error("Date cannot be parsed");
    }
    

    // Get the index from the english-language array
    let month: number = languages[1]["months"].indexOf(strArr[1]) + 1;
    // If it's valid, we keep it. If not, we fall back to the string
    month = (month >= 1 && month <= 12) ? month : parseInt(strArr[1]);

    function pad(num: number|string, len: number) {
        let numStr = num.toString();
        while (numStr.length < len) {
            numStr = "0" + numStr;
        }
        return numStr;
    }

    return `${strArr[2]}-${pad(month, 2)}-${pad(strArr[0], 2)}`;
}


function isoToLocale(isoDateStr: string, months: string[]) {
    let strArr = isoDateStr.split("-");
    let month = months[parseInt(strArr[1]) - 1];

    return `${strArr[2]} ${month} ${strArr[0]}`;
}