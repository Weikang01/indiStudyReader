function create(type, props, parent) {
    var el = document.createElement(type);
    for (var p in props) {
        el[p] = props[p];
    }
    if (parent) {
        parent.appendChild(el);
    }
    return el;
}

function chapter_changer(chapter_name) {
    var bookmarks = document.getElementsByClassName("bookmarkRepo");
    for (let j = 0; j < bookmarks.length; j++) {
        if (bookmarks[j].classList.contains(chapter_name))
            bookmarks[j].style.display = "block"
        else
            bookmarks[j].style.display = "none"
    }

    var files = document.getElementsByClassName("file");

    for (let j = 0; j < files.length; j++) {
        if (files[j].classList.contains(chapter_name))
            files[j].style.display = "block"
        else
            files[j].style.display = "none"
    }

    var floated_questions = document.getElementsByClassName("floated_question");
    for (let j = 0; j < floated_questions.length; j++) {
        if (floated_questions[j].classList.contains(chapter_name))
            floated_questions[j].style.display = "block"
        else
            floated_questions[j].style.display = "none"
    }
}

// entry point
window.onload = function () {
    var files = document.querySelectorAll(".file");

    files[0].style.display = "block";
    document.getElementsByClassName("floated_question")[0].style.display = "block";

    var bookmarks = document.getElementById("bookmarks");

    // add bookmarks + hide all files except the first one
    for (var i = 0; i < files.length; i++) {
        var file_div = create("div", { classList: files[i].classList[1] + " bookmarkRepo" }, bookmarks);
        var button  = create("div", {className:"button"}, document.getElementById("banner"));
        button.innerText = files[i].classList[1];

        if (i != 0)
            file_div.style.display = "none";

        var file_children = files[i].children;

        for (var j = 0; j < file_children.length; j++) {
            if (file_children[j].classList.contains("title")) {
                var title_children = file_children[j].children;
                for (let k = 0; k < title_children.length; k++) {
                    if (title_children[k].classList.contains("eng")) {
                        var titleClassName = title_children[k].innerText.replace(/\W/g, '');
                        file_children[j].id = titleClassName;

                        var bookmark = create("a", { href: "#" + titleClassName, classList: "bookmark" }, file_div);
                        bookmark.innerText = title_children[k].innerText.trim();
                    }
                }
            }
        }
    }

    // click button to change file
    var buttons = document.getElementsByClassName("button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function () {
            chapter_changer(this.innerText);
        };
    }

    // hide floating segment when click outside
    window.addEventListener("click", function (e) {
        if (!document.getElementById("rightFloatButton").contains(e.target) && (!document.getElementById("floating").contains(e.target) && document.getElementById("floating").style.display == "block")) {
            document.getElementById("rightFloatButton").style.right = "0";
            floating.style.display = "none";
        }

        if (document.activeElement != document.getElementById("keyword_checker") && !document.getElementById("keyword_hint_holder").contains(e.target))
            document.getElementById("keyword_hint_holder").style.display = "none";
    })

    // floating button onclick
    document.getElementById("rightFloatButton").onclick = function () {
        var floating = document.getElementById("floating");
        if (floating.style.display == "block") {
            this.style.right = "0";
            floating.style.display = "none";
        }
        else {
            this.style.right = "40%";
            floating.style.display = "block";
        }
    }

    // show/hide notation button
    const notationButton = document.querySelector("#notationButton input");
    notationButton.onclick = function () {
        var notations = document.getElementsByClassName("notation");
        if (notationButton.checked) {
            for (var i = 0; i < notations.length; i++)
                notations[i].style.display = "inline";
        }
        else {
            for (var i = 0; i < notations.length; i++)
                notations[i].style.display = "none";
        }
    }

    // hide all translation divisions
    var c_chis = document.querySelectorAll(".chi");
    for (let i = 0; i < c_chis.length; i++) {
        c_chis[i].style.display = "none";
    }
    
    // add translation button to each paragraph/title
    const paras = document.querySelectorAll(".para,.title");
    for (let i = 0; i < paras.length; i++) {
        var c_chi = paras[i].querySelector(".chi");
        if (c_chi.innerText.replace(/\s/g, '').length) {
            paras[i].querySelector(".chi").style.display = "none";
            var translate_button = paras[i].querySelector(".translate");

            var outer_div = create("div", { className: "lower_right" }, paras[i]);
            var outer_label = create("label", { className: "switch" }, outer_div);
            var inner_input = create("input", { className: "translate", type: "checkbox" }, outer_label);
            var inner_span = create("span", { className: "slider round" }, outer_label);

            inner_input.onclick = function () {
                var chi = this.parentElement.parentElement.parentElement.querySelector(".chi");
                var eng = this.parentElement.parentElement.parentElement.querySelector(".eng");
                if (chi.style.display == "none") {
                    chi.style.display = "inline";
                    eng.style.display = "none";
                }
                else {
                    eng.style.display = "inline";
                    chi.style.display = "none";
                }
            }
        }
    }

    // <input> element to check keyword
    const input_keyword = document.getElementById("keyword_checker");

    // show hints when the input element is focused
    input_keyword.onfocus = function () {
        if (document.querySelector("#keyword_hint_holder").style.display == "none" && document.querySelector("#keyword_hint_holder").innerHTML != "")
            document.querySelector("#keyword_hint_holder").style.display = "block";
    };

    // keyword checker implementation
    input_keyword.addEventListener("keyup", function(event) {
        if (event.keyCode == 13)  // if it is Enter
        {
            if (input_keyword.value.trim())
            {
                const files = document.getElementsByClassName("file");
                var pattern = new RegExp(input_keyword.value, 'gi');
                var files_list = new Array;

                for (let j = 0; j < files.length; j++) {
                    var count_result = files[j].innerText.match(pattern || []);
                    if (count_result)
                    {
                        count_result = count_result.length;
                        if (files_list.length)
                    {
                        let k = 0;
                        while (k < files_list.length && files_list[k][0] > count_result) { k++;}
                        files_list.splice(k, 0, [count_result, files[j].classList[1]]);
                    }
                    else
                        files_list.push([count_result, files[j].classList[1]]);
                    }
                }

                console.log(files_list);
                
                var keyword_hint_holder = document.querySelector("#keyword_hint_holder");
                keyword_hint_holder.innerHTML = "";

                if (files_list.length > 0)
                {
                    for (let j = 0; j < files_list.length; j++)
                    {
                        var keyword_hint = create("div", {className: "keyword_hint"}, keyword_hint_holder);
                        var keyword_title = create("div", {className: "keyword_title"}, keyword_hint);
                        keyword_hint.onclick = function()
                        {
                            chapter_changer(this.children[0].innerText);
                        };

                        var keyword_replicant_bubble = create("div", {className: "keyword_replicant_bubble"}, keyword_hint);
                        keyword_title.innerText = files_list[j][1];
                        keyword_replicant_bubble.innerText = files_list[j][0];
                    }
                    if (keyword_hint_holder.style.display == "none")
                    {
                        keyword_hint_holder.style.display = "block";
                    }
                }
                else
                {
                    var keyword_hint = create("div", {className: "keyword_hint"}, keyword_hint_holder);
                    var keyword_hint_no_matching_value = create("div", {id: "keyword_hint_no_matching_value"}, keyword_hint);
                    keyword_hint_no_matching_value.innerText = "... No matching results";
                }
            }
        }
    });
}