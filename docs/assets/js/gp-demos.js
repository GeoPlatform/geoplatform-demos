/* eslint-disable */
(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory())
    : typeof define === "function" && define.amd
    ? define(factory)
    : (global.gp_demos = factory());
})(this, function () {
  let hooks = {
    filters: [],
    search: "",
  };

  function init(options) {
    hooks = $.extend({}, hooks, options);
    hooks.filters = options.filters ? options.filters : [];
    hooks.filterEl = options.filterEl ? options.filterEl : [];
    hooks.sortBy = hooks.sortBy ? hooks.sortBy : "alphabetical";
    hooks.urlTarget = hooks.urlTarget || "_self";
    hooks.urlNewSource = hooks.urlNewSource || "_self";
    hooks.urlPartner = hooks.urlPartner || "_self";
    hooks.listEl = hooks.listEl[0] === "#" ? hooks.listEl : "#" + hooks.listEl;

    hooks.toggleAnimationSpeed = 0;
    hooks.openLinkWithEnterKey = true;
    hooks.itemSelector = ".search-item";
    hooks.searchTextBoxSelector = ".search-box";
    hooks.noItemsFoundSelector = ".no-apps-found";
    hooks.showFilters =
      hooks.showFilters == undefined ? true : hooks.showFilters;
    hooks.showSearch = hooks.showSearch == undefined ? true : hooks.showSearch;
    hooks.disableURL = hooks.disableURL == undefined ? false : hooks.disableURL;
    hooks.contactUsCard =
      hooks.contactUsCard == undefined ? true : hooks.contactUsCard;
    if (hooks.showFilters) {
      var paramObj = getParamsFromUrl();
      if (paramObj && paramObj.cq) {
        hooks.search = paramObj.cq;
      }
      if (paramObj && paramObj.cf) {
        hooks.filters = paramObj.cf;
      }
      if (paramObj && paramObj.cs) {
        hooks.sortBy = paramObj.cs;
      }
    }
    if (hooks.showSearch) {
      renderSearch();
    }
    const container = $("<div>", {
      class: "list-container",
    });
    $(hooks.listEl).append(container);

    optionsContainer = $("<div>", {
      class: "container collection floatleft options-container",
      id: "listContainer",
    });
    container.append(optionsContainer);

    getData(hooks.url, function (err, data) {
      initialData = data;
      currentData = $.extend(true, [], initialData);
      resetSearch();
      if (hooks.showFilters) {
        filterController($(hooks.filterEl), initialData);
      }

      $(hooks.filterEl).on("click", "li.sortBy", function (opts) {
        $("li.sortBy").removeClass("active");
        $(opts.currentTarget).toggleClass("active");
        hooks.sortBy = opts.currentTarget.dataset.value;
        sortList();
        searchListItems(
          $(hooks.listEl + " " + hooks.searchTextBoxSelector)[0].value
        );
      });

      $(hooks.filterEl).on("click", "li.filterBy", function (opts) {
        var value = opts.currentTarget.dataset.value;

        if (
          hooks.filters
            .map((x) => x.toLowerCase())
            .indexOf(value.toLowerCase()) !== -1
        ) {
          hooks.filters.splice(hooks.filters.indexOf(value), 1);
        } else {
          hooks.filters.push(value);
        }
        $(opts.currentTarget).toggleClass("active");
        filterList();
        searchListItems(
          $(hooks.listEl + " " + hooks.searchTextBoxSelector)[0].value
        );
      });
      $(hooks.listEl).on(
        "keydown",
        hooks.searchTextBoxSelector,
        function (event) {
          if (event.keyCode === 39) selectNextItem("next");
          if (event.keyCode === 37) selectNextItem("prev");
          if (event.keyCode === 13) openLink();
        }
      );

      $(hooks.listEl).on("click", hooks.itemSelector, openItemLink);

      initializeListSearch(hooks);
      var filterListItems = $(hooks.filterEl + " li.filterBy");
      for (var i = 0; i < filterListItems.length; i++) {
        if (hooks.filters.indexOf($(filterListItems[i]).data("value")) !== -1) {
          $(filterListItems[i]).addClass("active");
        }
      }
      filterList();
      $('li.sortBy[data-value="' + hooks.sortBy + '"]').addClass("active");
      sortList();
      searchListItems(hooks.search);
    });
  }

  function renderSearch() {
    const elem =
      hooks.searchTextBoxSelector[0] === "."
        ? hooks.searchTextBoxSelector.substr(1)
        : hooks.searchTextBoxSelector;
    const div = $("<div>", {
      id: "searchContainer",
    });
    const searchInput = $("<input>", {
      id: "search",
      autocomplete: "off",
      class: elem,
      placeholder: "Search",
      type: "text",
    });
    div.append(searchInput);
    div.append('<div id="clearBtn" class="clearBtn">Clear</div> </div>');
    $(hooks.listEl).append(div);
    $(hooks.listEl).on("click", "div#searchContainer", function (opts) {
      document.getElementById("clearBtn").style.visibility = "visible";
    });

    $(hooks.listEl).on("click", "div.clearBtn", function (opts) {
      opts.stopPropagation();
      $(searchInput).prop("value", "").trigger("propertychange");
      searchListItems(hooks.search);
      setHashState();
    });

    $(hooks.listEl).on(
      "input propertychange",
      hooks.searchTextBoxSelector,
      function (opts) {
        hooks.search = opts.currentTarget.value;
        if (hooks.search !== "") {
          searchListItems(opts.currentTarget.value);
          setHashState();
        } else {
          searchListItems(hooks.search);
          setHashState();
        }
      }
    );

    $(hooks.listEl + " " + hooks.searchTextBoxSelector)[0].value = hooks.search;
    searchListItems(hooks.search);
  }

  function filterController(parent, initialData) {
    const filterContainer = $("<div>", {
      class: "filter-container floatleft",
    });
    filterContainer.append("<h5>Sort By</h5>");
    // filterContainer.append('<div><ul class="collection collection-item"><li class="sortBy collection-item" data-value="popularity">Most Popular</li><li class="sortBy collection-item" data-value="alphabetical">Alphabetical</li><li class="sortBy collection-item" data-value="date">Recently Added</li></ul></div>');
    filterContainer.append(
      '<div><ul class="collection collection-item"><li class="sortBy collection-item" data-value="alphabetical">Alphabetical</li><li class="sortBy collection-item" data-value="date">Recently Added</li></ul></div>'
    );

    const tagsContainer = $("<div>", {
      class: "tag_categories",
    });
    filterContainer.append(tagsContainer);

    // Temp commenting out until we have more types to filter by
    //filterContainer.append('<h5>Filter By Type</h5>');
    // const types = getTypes(initialData);
    // const ulType = $('<ul>', {
    //     class: 'collection collection-item'
    // });

    // types.forEach(function(type) {
    //     ulType.append($('<li>', {
    //         class: 'collection-item filterBy',
    //         'data-value': type,
    //         html: type
    //     }));
    // });

    // filterContainer.append(ulType);
    filterContainer.append("<h5>Filter By Category</h5>");
    const tags = getTags(initialData);
    const ul = $("<ul>", {
      class: "collection collection-item",
    });
    tags.forEach(function (tag) {
      ul.append(
        $("<li>", {
          class: "collection-item filterBy",
          "data-value": tag,
          html: tag,
        })
      );
    });
    filterContainer.append(ul);
    $("#listContainer").attr("style", "width:100% !important");
    parent.append(filterContainer);
  }

  function getData(url, cb) {
    $.getJSON(url, function (data, status) {
      if (status === "success") {
        cb(null, data);
      } else {
        cb("err");
      }
    });
  }

  function renderList(data) {
    optionsContainer.empty();
    let li;
    const searchClass =
      hooks.itemSelector[0] === "."
        ? hooks.itemSelector.substr(1)
        : hooks.itemSelector;

    data.forEach(function (element) {
      li = $("<div>", {
        class: searchClass + " database-item item-container",
        "data-url": element.itemUrl,
        "data-value": element.name ? element.name.toLowerCase() : element.name,
        "data-synonym": element.synonyms
          ? element.synonyms.join(" ").toLowerCase()
          : "",
      });

      if (
        element.img ===
        "https://sit.geoplatform.info/assets/images/theme/gp-backdrop-full-logo.jpg"
      ) {
        element.img = "/assets/images/gp_logo_darkbac.svg";
      }
      if (element.popularity < 10) {
        li.append(
          $("<div>", {
            class: "star",
          })
        );
      } else {
        li.append(
          $("<div>", {
            class: "no-star",
          })
        );
      }

      li.append(
        $("<div>", {
          class: "item-container-item",
          style: "background-image: url(" + element.img + ");",
        })
      )
        .append(
          $("<div>", {
            class: "database-item title",
            html:
              element.name.length >= 61
                ? element.name.slice(0, 58) + "..."
                : element.name,
          })
        )
        .append(
          $("<div>", {
            class: "database-item details",
            html: "View →",
          })
        )
        .append(
          $("<div>", {
            class: "bottom-banner",
          })
        )
        .append(
          $("<div>", {
            class: element.type.toLowerCase() + " type",
            html: element.type,
          })
        )
        .append(
          $("<div>", {
            class: "support-status",
            html: element.supportLevel,
          })
        );
      optionsContainer.append(li);
    });

    if (hooks.contactUsCard) {
      createContactUsCard(optionsContainer, searchClass);
      optionsContainer.append(
        $("<div>", {
          "data-url": hooks.urlNewSource,
          class: "database-item no-apps-found item-container",
          html: "Have us to build your voice app.",
        })
      );
    }
    setHashState();
  }

  function createContactUsCard(container, searchClass) {
    // Partner card
    let img = "/assets/demos-widget/img/database-solid.svg";
    li = $("<div>", {
      class:
        searchClass + " database-item item-container no-apps-found-integration",
      "data-url": hooks.urlPartner,
      "data-value": "integration request",
      "data-synonym": "nothere",
    });

    li.append(
      $("<div>", {
        class: "integration-item",
        style: "background-image: url(" + img + ");",
      })
    )
      .append(
        $("<div>", {
          html: "Looking for a <br>different use case?",
        })
      )
      .append(
        $("<div>", {
          class: "database-item details",
          html: "Contact us",
        })
      )
      .append(
        $("<div>", {
          class: "integration",
        })
      );

    container.append(li);
  }

  function getTags(data) {
    let tagsArray = [];
    data.forEach(function (obj) {
      tagsArray = tagsArray.concat(obj.tags);
    });
    tagsArray = [...new Set(tagsArray)];
    return tagsArray.sort();
  }

  function getTypes(data) {
    let typesArray = [];
    data.forEach(function (obj) {
      typesArray = typesArray.concat(obj.type);
    });
    typesArray = [...new Set(typesArray)];
    return typesArray.sort();
  }

  function sortList() {
    switch (hooks.sortBy) {
      case "alphabetical":
        currentData.sort(function (first, next) {
          return first.name < next.name ? -1 : 1;
        });
        break;
      case "popularity":
        currentData.sort(function (first, next) {
          return first.popularity - next.popularity;
        });
        break;
      case "date":
        currentData.sort(function (first, next) {
          return first.date < next.date ? 1 : -1;
        });
        break;
    }
    renderList(currentData);
  }

  function filterList(filter) {
    currentData = $.extend(true, [], initialData);
    var elemArray = [];
    if (hooks.filters.length > 0) {
      // check if filter contains tag before filtering on tag
      let tags = getTags(initialData);
      let containsTags = hooks.filters.filter((x) => tags.indexOf(x) !== -1);
      if (containsTags.length > 0) {
        currentData = $.grep(currentData, function (elem) {
          elemArray = $.grep(elem.tags, function (tag) {
            return hooks.filters.indexOf(tag) !== -1 ? true : false;
          });
          return elemArray.length ? true : false;
        });
      }
      // check if filter contains type before filtering on type
      let type = getTypes(initialData);
      type = type.map((x) => {
        return x.toLowerCase();
      });

      let containsType = hooks.filters.some((item) => {
        return type.includes(item.toLowerCase());
      });

      if (containsType) {
        currentData = currentData.filter(function (ele) {
          return (
            hooks.filters
              .map((v) => v.toLowerCase())
              .indexOf(ele.type.toLowerCase()) !== -1
          );
        });
      }
    }
    sortList();
  }

  function openItemLink() {
    window.open($(this).data("url"), hooks.urlTarget);
  }

  function setHashState() {
    if (!hooks.disableURL) {
      var filterObj = {
        cs: hooks.sortBy,
        cf: hooks.filters,
        cq: hooks.search,
      };
      history.pushState(null, null, encodeURI(JSON.stringify(filterObj)));
      // window.location.hash = encodeURI(JSON.stringify(filterObj));
    }
  }

  getParamsFromUrl = function () {
    var filterObj = window.location.hash.substr(1);
    if (filterObj != "") {
      filterObj = decodeURIComponent(filterObj);
      filterObj = JSON.parse(filterObj);
    }
    return filterObj;
  };

  let toggleAnimationSpeed;
  let itemSelector;
  let foundItems;
  let cssActiveClass;
  let openLinkWithEnterKey;
  let searchTextBoxSelector;
  let noItemsFoundSelector;
  let integrationSelector;
  let initialData;
  let currentData;
  let optionsContainer;

  function initializeListSearch(data) {
    if (data === undefined || data === null) {
      setDefaultValues();
      return;
    }

    toggleAnimationSpeed =
      typeof data.toggleAnimationSpeed !== "undefined"
        ? data.toggleAnimationSpeed
        : 250;
    cssActiveClass =
      typeof data.cssActiveClass !== "undefined"
        ? data.cssActiveClass
        : "active";
    itemSelector =
      typeof data.itemSelector !== "undefined"
        ? data.itemSelector
        : ".search-item";
    openLinkWithEnterKey =
      typeof data.openLinkWithEnterKey !== "undefined"
        ? data.openLinkWithEnterKey
        : false;
    searchTextBoxSelector =
      typeof data.searchTextBoxSelector !== "undefined"
        ? data.searchTextBoxSelector
        : ".search-box";
    noItemsFoundSelector =
      typeof data.noItemsFoundSelector !== "undefined"
        ? data.noItemsFoundSelector
        : ".no-apps-found";
    integrationSelector =
      typeof data.integrationSelector !== "undefined"
        ? data.integrationSelector
        : "div.search-item.database-item.item-container.no-apps-found-integration";
  }

  function setDefaultValues() {
    toggleAnimationSpeed = 250;
    itemSelector = ".search-item";
    cssActiveClass = "active";
    openLinkWithEnterKey = false;
    searchTextBoxSelector = ".search-box";
    noItemsFoundSelector = ".no-apps-found";
    integrationSelector = ".no-apps-found-integration";
  }

  function searchListItems(searchText) {
    if (searchText === "") {
      $(noItemsFoundSelector).hide();
      resetSearch();
      return;
    }
    foundItems = findItemsInList(searchText);
    if (foundItems.length > 0 && openLinkWithEnterKey) {
      foundItems[0].addClass(cssActiveClass);
      $(noItemsFoundSelector).hide();
    } else {
      // Uses the input propertyChange event to update text displayed
      // in the not yet supported card shown if no results are available
      $(noItemsFoundSelector).show();
      $(noItemsFoundSelector).html(
        "<span><b>" +
          hooks.search +
          '</b><br>Different use case?</span><div class=contact><a href="https://geoplatform.atlassian.net/servicedesk/customer/portal/3">Contact Us!</a></div>'
      );
    }
  }

  function resetSearch() {
    $(itemSelector).slideDown(toggleAnimationSpeed);
    $(itemSelector).removeClass(cssActiveClass);
    foundItems = $(itemSelector);
  }

  function findItemsInList(searchText) {
    const list = $(itemSelector);
    const result = [];
    for (let i = 0; i < list.length; i++) {
      const element = list[i];

      $(element).removeClass(cssActiveClass);
      let indexOf = $(element)
        .data("value")
        .toLowerCase()
        .indexOf(searchText.toLowerCase());
      let synonym = $(element)
        .data("synonym")
        .toLowerCase()
        .indexOf(searchText.toLowerCase());
      let isIntegrationElement =
        $(element).data("value").toLowerCase().indexOf("integration") >= 0;
      // Check if the searchText exists in either the data-synonym or data-value element properties
      // A value greater than 0 indicates that the search term was found at a specific index in the string
      if (indexOf >= 0 || synonym >= 0) {
        result.push($(element));
        $(element).slideDown(toggleAnimationSpeed);
      } else {
        $(element).slideUp(toggleAnimationSpeed);
      }
    }
    return result;
  }

  function selectNextItem(direction) {
    if (!openLinkWithEnterKey) return;

    const activeItem = $(itemSelector + "." + cssActiveClass);

    if (activeItem.length === 0) {
      if (direction === "next") $(foundItems[0]).addClass(cssActiveClass);
      if (direction === "prev")
        $(foundItems[foundItems.length - 1]).addClass(cssActiveClass);
    } else {
      const current = $(itemSelector + "." + cssActiveClass);
      current.removeClass(cssActiveClass);

      if (direction === "next")
        current
          .nextAll(itemSelector + ":visible")
          .first()
          .addClass(cssActiveClass);
      if (direction === "prev")
        current
          .prevAll(itemSelector + ":visible")
          .first()
          .addClass(cssActiveClass);
    }
  }

  function openLink() {
    if (!openLinkWithEnterKey) return;
    openItemLink.apply($(itemSelector + "." + cssActiveClass));
  }

  hooks.init = init;
  return hooks;
});
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
})($)(function ($) {
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
