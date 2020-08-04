(function ($) {
    "use strict"; // Start of use strict
    // console.log('Starting up');

    $(document).ready(function () {
        initPage();
        $(".portfolio-link").click(onShow);
    });


    function initPage() {
        renderPortfolioItem();
    }

    function renderPortfolioItem() {

        var projects = getProjects();
        if (projects || projects.length > 0) {
            var strHTMLs = projects.map(function (project) {
                return `
                <div class="col-md-4 col-sm-6 portfolio-item">
                    <a class="portfolio-link" data-toggle="modal" href="#portfolioModal1" 
                    data-id="${project.id}">
                        <div class="portfolio-hover">
                        <div class="portfolio-hover-content">
                            <i class="fa fa-plus fa-3x"></i>
                        </div>
                        </div>
                        <img class="img-fluid" src="img/portfolio/${project.id}-thumbnail.jpg" alt="${project.name}">
                    </a>
                    <div class="portfolio-caption">
                        <h4>${project.name}</h4>
                        <p class="text-muted">${project.desc}</p>
                    </div>
                </div>
            `;
            });

            $('.portfolio-items').html(strHTMLs.join(''));
        }
    }

    function onShow(ev) {
        var projectId = ev.currentTarget.attributes['data-id'].value;
        var proj = getProjById(projectId);
        renderPortfolioModal(proj);
    }

    function renderPortfolioModal(project) {

        var strLabels = project.labels.map(function (label) {
            return `<span class="badge badge-pill badge-dark">${label}</span>`;
        });

        var strHTML = `
                <h2>${project.name}</h2>
                <p class="item-intro text-muted">${project.desc}</p>
                <img class="img-fluid d-block mx-auto" src="img/portfolio/${project.id}-full.jpg" alt="${project.name}">
                <p>${project.desc}</p>
                
                <button class="btn btn-primary" data-dismiss="modal" type="button" 
                onclick="window.open('${project.url}/index.html?type=individual', '_blank')">
                Check it Out!</button>
                
                <ul class="list-inline">
                  <li>Date: ${new Date(project.publishedAt).toLocaleDateString(navigator.language)}</li>
                  <!-- <li>Client: Threads</li> -->
                  <li>Category: ${strLabels.join(' ')}</li>
                </ul>
                <button class="btn btn-primary bg-warning" data-dismiss="modal" type="button">
                  <i class="fa fa-times"></i>
                  Close Project</button>
                `; // .toLocaleDateString('en-GB')

        $('.modal-body').html(strHTML);
    }

    function onSubmit() {
        $()
    }

})(jQuery); // End of use strict