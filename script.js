$(document).ready(function () {

    var clipBoard = "";
    addListeners();
    var decorBold = false;
    var decorItalic = false;
    var decorUnderline = false;
    var range;

    function pasteClick() {
        $('#text').trigger('paste');
    }

    function pasteAsText() {
        range = document.getSelection().getRangeAt(0);
        let txt = clipBoard.replace('<table>','');
        txt = txt.replace('</table>','');
        txt = txt.replace('<img>','');
        alert(clipBoard.replace('<table>',''));
        insertHtmlAtCursor(txt);
        clipBoard = "";
    }

    function copyClick() {
        try {
            let successful = document.execCommand('copy');
            clipBoard = document.getSelection().toString();
        } catch(err) {
            alert('Error');
        }
    }

    function cutClick() {
        try {
            clipBoard = document.getSelection().toString();
            let successful = document.execCommand('cut');
        } catch(err) {
            alert('Error');
        }
    }

    function hideModalForm() {
        $('#modal_form_container').css('display', 'none');
        $('#prompt_form').css('display', 'none');
        $('#picture_form').css('display', 'none');
        $('#import_form').css('display', 'none')
    }

    function addTable() {
        let rows = $('#rows').val(),
			colms = $('#colms').val();

        hideModalForm();

        var strTable = '<table>';
        for (let i = 0; i < rows; i++) {
            strTable += '<tr>';
            for (let j = 0; j < colms; j++) {
                strTable += '<td>Your text</td>';
            }
            strTable += '</tr>';
        }
        strTable += '</table>';
        insertHtmlAtCursor(strTable);
    }

    function addPicture() {
        let URL = $('#URL').val();
        insertHtmlAtCursor('<img src="' + URL + '"/>');
        hideModalForm();
    }

    function showPromptTable() {
        range = document.getSelection().getRangeAt(0);
        $('#modal_form_container').css('display', 'block');
        $('#prompt_form').css('display', 'inline-block');
    }

    function showPromptPicture() {
        range = document.getSelection().getRangeAt(0);
        $('#modal_form_container').css('display', 'block');
        $('#picture_form').css('display', 'inline-block');
    }

    function showPromptImport() {
        $('#modal_form_container').css('display', 'block');
        $('#import_form').css('display', 'inline-block');
    }

    function onFilesSelect(e) {
        fr = new FileReader();
        hideModalForm();
        if(e.target.files.length == 1){
            let file = e.target.files[0];
            fr.readAsText(file);
            fr.onload = (function () {
                return function (e) {
                    let text = JSON.parse(e.target.result).value;
                    if(text != null){
                        $('#text').html(text);
                    }
                }
            })();
        }
        else {
            alert("Please, select one file");
        }
    }

    function download(file) {
        let myFile = new File([file], {'type': 'json'}),
        	link = document.createElement("a"),
        	url = window.URL.createObjectURL(myFile);
        link.download = "text.json";
        link.href = url;
        link.click();
    }

    function exportFile() {
        let $text = $('#text').html();
        let json = {
            value: $text
        };
        let jsonStr = JSON.stringify(json);

        download(jsonStr);
    }

    function printFile() {
        const first = 0;
        let text = $('#text').html();
        let $iFrame = $('<iframe id="frame" style="display: none">');
        $('body').append($iFrame);
        let newDoc = $iFrame[first].contentDocument || $iFrame[first].contentWindow.document;
        let newWindow = $iFrame[first].contentWindow || $iFrame[first];
        newDoc.getElementsByTagName('body')[first].innerHTML = text;
        newWindow.print();
        $('#frame').remove();
    }

    function addListeners() {
        var history = new History($('#text'));
        history.saveState();

        $('.boldButton').on('click', {decor: "bold"}, editText);
        $('.italicButton').on('click', {decor: "italic"}, editText);
        $('.ulineButton').on('click', {decor: "underline"}, editText);
        $('.leftButton').on('click', {decor: "left"}, formatText);
        $('.centerButton').on('click', {decor: "center"}, formatText);
        $('.rightButton').on('click', {decor: "right"}, formatText);
        $('.pasteButton').on('click', pasteClick);

        $('#prompt_form .okButton').on('click', addTable);
        $('#prompt_form .cancelButton').on('click',hideModalForm);

        $('#picture_form .okButton').on('click', addPicture);
        $('#picture_form .cancelButton').on('click', hideModalForm);//
        $('.pasteAsText').on('click', pasteAsText);

        $('.tableButton').on('click', showPromptTable);
        $('.picButton').on('click', showPromptPicture);
        $('.copyButton').on('click', copyClick);
        $('.cutButton').on('click', cutClick);
        $('.exportButton').on('click', exportFile);
        $('.printButton').on('click', printFile);


        $('.importButton').on('click', showPromptImport);
        $('#import_form .cancelButton').on('click', hideModalForm);

        $('#text').on('paste', function (event) {
            range = document.getSelection().getRangeAt(0);
            insertHtmlAtCursor(clipBoard);
            clipBoard = "";
        });

        $('#text').on('copy', function (event) {
            clipBoard = document.getSelection().toString();
        });

        $('#text').on('cut', function (event) {
            clipBoard = document.getSelection().toString();
        });

        if(window.File && window.FileReader && window.FileList && window.Blob) {
               $('#inpImport').on('change', onFilesSelect);
        } else {
            alert('Unfortunately, your browser not support API');
        }
    }

    function formatText(event) {
        $('#text').removeClass();
        $('#text').addClass(event.data.decor);
    }

    function editText(event) {
        var txt = '';
        var $text;
        range = document.getSelection().getRangeAt(0);
        txt = document.getSelection().toString();

        if (event.data.decor == 'bold') {
            var $newElem = $('<span/>').html(txt);
            if (!decorBold) {
                $newElem.addClass(event.data.decor);
                decorBold = true;
            }
            else {
                $newElem.addClass('non' + event.data.decor);
                decorBold = false;
            }
        }
        else if (event.data.decor == 'italic') {

            var $newElem = $('<span/>').html(txt);
            if (!decorItalic) {
                $newElem.addClass(event.data.decor);
                decorItalic = true;
            }
            else {
                $newElem.addClass('non' + event.data.decor);
                decorItalic = false;
            }
        }
        if (event.data.decor == 'underline') {

            var $newElem = $('<span/>').html(txt);

            if (!decorUnderline) {
                $newElem.addClass(event.data.decor);
                decorUnderline = true;
            }
            else {
                $newElem.addClass('non' + event.data.decor);
                $newElem.removeClass(event.data.decor);
                decorUnderline = false;
            }
        } else if (event.data.decor == 'left') {

            var $newElem = $('<span/>').html(txt).addClass(event.data.decor);
        } else if (event.data.decor == 'center') {
            alert('center');
            var $newElem = $('<span/>').html(txt).addClass('center');
        }
        else if (event.data.decor == 'right') {
            var $newElem = $('<span/>').html(txt).addClass(event.data.decor);
        }
        range.deleteContents();
        range.insertNode($newElem.get(0));
    }

    function insertHtmlAtCursor(html) {
        var node;
        if (document.getSelection && document.getSelection().getRangeAt) {
            node = range.createContextualFragment(html);
            range.insertNode(node);
        } else if (document.selection && document.selection.createRange) {
            document.selection.createRange().pasteHTML(html);
        }
    }
});