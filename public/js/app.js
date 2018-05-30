window.addEventListener('load', () => {
    const el = $('#app');
    // Compile Handlebar Templates
    const errorTemplate = Handlebars.compile($('#error-template').html());
    const ratesTemplate = Handlebars.compile($('#rates-template').html());
    const exchangeTemplate = Handlebars.compile($('#exchange-template').html());
    const historicalTemplate = Handlebars.compile($('#historical-template').html());
 
    // Router Declaration

    const router = new Router({
        mode : 'history',
        page404: (path) => {
            const html = errorTemplate({
                color:'yellow',
                title : 'Error 404 - Page NOT Found!',
                message: `The path  '/${path}' does not exist on this site`,
            });
            el.html(html);
        },
    });

    // Instantiate api handler
    const api = axios.create({
        baseURL: 'http://localhost:3000/api',
        timeout: 5000,
    });
    // Display Error Banner
    const showError = (error) => {
        const { title, message } = error.response.data;
        const html = errorTemplate({ color: 'red', title, message });
        el.html(html);
    };

    'red'// Display Latest Currency Rates
    router.add('/', async () => {
        // Display loader first
        let html = ratesTemplate();
        el.html(html);
        try {
            // Load Currency Rates
            const response = await api.get('/rates');
            const { base, date, rates } = response.data;
            // Di'/rates'// Display Rates Table
            html = ratesTemplate({ base, date, rates });
            el.html(html);
        } catch (error) {
            showError(error);
        } finally {
        // Remove loader status
            $('.loading').removeClass('loading');
        }
    });

    router.add('/exchange', async () => {
        // Display loader first
        let html = exchangeTemplate();
        el.html(html);
    });
   
    router.add('/historical', () => {
        let html = historicalTemplate();
        el.html(html);
    });

    // Navigate app to current url

    router.navigateTo(window.location.pathname);

    // Highlight active menu on refresh/page reload
    const link = $(`a[href='${window.location.pathname}']`);
    link.addClass('active');


    $('a').on('click', (event) => {
        // block browser page load
        event.preventDefault();

        // highlight active menu on click
        const target = $(event.target);
        $('.item').removeClass('active');
        target.addClass('active');

        // navigate to clicked url
        const href = target.attr('href');
        const path = href.substr(href.lastIndexOf('/'));
        router.navigateTo(path);


    })


});