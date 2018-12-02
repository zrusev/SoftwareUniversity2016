$(() => {

    renderCatTemplate();

    function renderCatTemplate() {
        let source = $('#cat-template').html();
        let template = Handlebars.compile(source);

        Handlebars.registerHelper('json', function () {
            return showAndHideInfo();
        });

        let cats = {
            "items": window.cats
        }

        $('#allCats').html(template(cats));
    }

    function showAndHideInfo() {
        let btn = $(this);

        if (btn.text() === 'Show status code') {
            btn.next().css('display', 'block');
            btn.text('Hide status code');
        } else {
            btn.next().css('display', 'none');
            btn.text('Show status code');
        }
    }
})