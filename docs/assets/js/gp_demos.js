/* based on https://github.com/GeoPlatform/geoplatform_portal/blob/develop/src/app/pages/demos-page/demos-page.component.ts */

(function ($) {
  $(document).ready(function () {
    gp_demos.init({
      url: "https://geoplatform.github.io/geoplatform-demos/demos.json",
      showFilters: true,
      disableURL: true,
      showSearch: true,
      contactUsCard: true,
      filters: [],
      sortBy: "alphabetical",
      filterEl: "#filterList",
      listEl: "#myList",
      urlTarget: "_blank",
      urlNewSource: "_newSource",
      urlPartner:
        "https://geoplatform.atlassian.net/servicedesk/customer/portal/3",
    });
  });
})($);
