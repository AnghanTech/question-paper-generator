{
  const sideNavigationContainer = document.getElementById(
    "side_navigation_container"
  ); //side nav

  // open side nav on click on bar button
  {
    document
      .getElementById("bars_container")
      .addEventListener("click", function () {
        sideNavigationContainer.style.left = "0px";
        document.body.style.overflowY = "hidden";
      });

    //hide side nav on resizing
    window.addEventListener("resize", function () {
      if (window.innerWidth > 960) sideNavigationContainer.style.left = "";
      document.body.style.overflowY = "";
    });

    //close side nav
    document
      .getElementById("close_link")
      .addEventListener("click", function (e) {
        e.preventDefault(); // prevent link from clicking
        sideNavigationContainer.style.left = "";
        document.body.style.overflowY = "";
      });
  }
  {
    let sideTouchStartX = 0; // x coordinate of first touch of side nav
    let sideTouchStartY = 0; // y coordinate of first touch of side nav
    let preSidePageX = 0; // previous x coordinate for side nav

    let sideI = 0;

    let sideFlag = false;
    let netDistance = 0;
    //listen for touch-start on side nav for closing

    sideNavigationContainer.addEventListener("touchstart", function (e) {
      let touchObj = {};
      touchObj = e.changedTouches[0]; // html element which has been touched
      sideTouchStartX = preSidePageX = touchObj.pageX; // x coordinate of touch
      sideTouchStartY = touchObj.pageY;
      // reset for every touch start event
      sideFlag = false;
      sideI = 0;
      netDistance = 0;
      // }
    });

    sideNavigationContainer.addEventListener("touchmove", function (e) {
      let touchObj = {};
      let distance = 0;
      let left = 0;
      if (sideFlag) return;
      touchObj = e.changedTouches[0];
      distance = touchObj.pageX - preSidePageX;
      netDistance += distance;
      if (sideI === 0) {
        let yDiff = 0;
        sideI++;
        yDiff = Math.abs(touchObj.pageY - sideTouchStartY);
        if (yDiff > Math.abs(distance)) {
          sideFlag = true; //mark flag if user has done swipe with angle > 45
          return;
        }
      }

      preSidePageX = touchObj.pageX;
      left = parseInt(sideNavigationContainer.style.left);
      if (left + distance <= 0) {
        sideNavigationContainer.style.left = `${left + distance}px`;
      } else sideNavigationContainer.style.left = "0px";
      e.preventDefault(); // to avoid scroll
      // }
    });

    sideNavigationContainer.addEventListener("touchend", function (e) {
      let touchObj = {};
      let distance = 0;

      if (sideFlag) return;
      try {
        touchObj = e.changedTouches[0];
        distance = touchObj.pageX - sideTouchStartX;
      } catch (e) {
        distance = netDistance;
      } finally {
        if (-distance >= 40) {
          sideNavigationContainer.style.left = "";
          document.body.style.overflowY = "";
        } else {
          sideNavigationContainer.style.left = "0px";
          document.body.style.overflowY = "hidden";
        }
      }
    });
  }
  {
    const mainContainer = document.getElementById("main_container"); //main page

    const initialLeft = parseInt(
      window.getComputedStyle(sideNavigationContainer).left
    ); //initial left style of side nav

    let mainTouchStartX = 0; // x coordinate of first touch of main page
    let mainTouchStartY = 0; // y coordinate of first touch of main page
    let preMainPageX = 0; // previous x coordinate for main page
    let mainI = 0;
    let mainFlag = false;
    let netDistance = 0;
    // mainContainer.style.paddingTop = "100px"; // for all pages except question list

    mainContainer.addEventListener("touchstart", function (e) {
      let touchObj = {};
      if (window.innerWidth > 960) return; //do not process if screen width is greater than 960
      touchObj = e.changedTouches[0];
      mainTouchStartX = touchObj.pageX;
      mainTouchStartY = touchObj.pageY;
      preMainPageX = touchObj.pageX;
      mainFlag = false;
      mainI = 0;
      netDistance = 0;
    });

    mainContainer.addEventListener("touchmove", function (e) {
      let touchObj = {};
      let distance = 0;
      let left = 0;
      if (mainFlag) return;
      if (window.innerWidth > 960) return;
      touchObj = e.changedTouches[0];
      distance = touchObj.pageX - preMainPageX;
      netDistance = netDistance + distance;
      if (mainI === 0) {
        let yDiff = 0;
        mainI++;
        yDiff = Math.abs(touchObj.pageY - mainTouchStartY);
        if (yDiff > Math.abs(distance)) {
          //mark flag if user has done swipe with angle > 45
          mainFlag = true;
          return;
        }
      }
      if (mainTouchStartX > 100) return; // if user touched from screen at distance greater than 100px then do not process it
      e.preventDefault(); //avoid scroll
      preMainPageX = touchObj.pageX;
      left = parseInt(sideNavigationContainer.style.left || initialLeft);
      if (left + distance <= 0)
        sideNavigationContainer.style.left = `${left + distance}px`;
      else sideNavigationContainer.style.left = "0px";
    });

    mainContainer.addEventListener("touchend", function (e) {
      let touchObj = {};
      let distance = 0;
      if (
        mainTouchStartX > 100 ||
        sideNavigationContainer.style.left >= "0px" || //if already side nav is present at correct position
        mainFlag ||
        window.innerWidth > 960
      )
        return;

      // if (initialLeft > parseInt(sideNavigationContainer.style.left)) {
      //   sideNavigationContainer.style.left = `${initialLeft}px`;
      //   return;
      // }
      try {
        touchObj = e.changedTouches[0];

        distance = touchObj.pageX - mainTouchStartX;
      } catch (e) {
        distance = netDistance;
      } finally {
        if (distance >= 40) {
          sideNavigationContainer.style.left = "0px";
          document.body.style.overflowY = "hidden";
        } else {
          sideNavigationContainer.style.left = "";
          document.body.style.overflowY = "";
        }
      }
    });
  }
}

{
  let isHomePage = false;
  let areAdditionalPages = false;
  let isLogin = false;
  let isQuestionPage = false;
  let isCoursesPage = false;
  {
    const additionalPages = [
      "about-us",
      "help",
      "privacy-policy",
      "terms-of-service",
      "contact-us",
    ];
    const url = window.location.href;

    isHomePage = !!(
      url.match(new RegExp("/", "g")).length === 3 &&
      url[url.length - 1] === "/"
    );

    isLogin =
      url.indexOf("login") !== -1 || url.indexOf("register") !== -1
        ? true
        : false;

    isQuestionPage = url.indexOf("question") !== -1 ? true : false;
    isCoursesPage = url.match(/.+course\/$/) ? true : false;

    for (let page of additionalPages) {
      const index = url.indexOf(page);
      if (index !== -1) {
        areAdditionalPages = true;
        break;
      }
    }
  }
  {
    const sideNavigationItems = document.getElementsByClassName(
      "side_navigation_items"
    );
    const exploreContainer = document.getElementById("explore_container");
    const addContainer = document.getElementById("add_container");
    const courseContainer = document.getElementById("course_container");
    const childrenLength = courseContainer.children.length;
    const moreItemsContainer =
      sideNavigationItems[childrenLength + 13].parentNode;
    const addMCQ = sideNavigationItems[childrenLength + 4];
    const addQuestion = sideNavigationItems[childrenLength + 5];
    const viewMCQ = sideNavigationItems[childrenLength + 1];
    const viewQuestion = sideNavigationItems[childrenLength + 2];
    const addCourse = sideNavigationItems[childrenLength + 6];
    const removeCourse = sideNavigationItems[childrenLength + 7];
    const course = sideNavigationItems[childrenLength + 9];
    const aboutUs = sideNavigationItems[childrenLength + 10];
    const help = sideNavigationItems[childrenLength + 11];
    const contactUs = sideNavigationItems[childrenLength + 12];

    const logIn = sideNavigationItems[childrenLength + 17];
    const logOut = sideNavigationItems[childrenLength + 18];

    if (isHomePage || areAdditionalPages || isLogin) {
      exploreContainer.style.display = "none";
      addContainer.style.display = "none";
      courseContainer.style.display = "none";
      moreItemsContainer.style.display = "none";
      course.style.display = logOut.style.display = "none";
      addCourse.style.display = "none";
      removeCourse.style.display = "none";
      if (isLogin) {
        logIn.style.display = "none";
      }
    } else {
      if (isQuestionPage) {
        addMCQ.style.display = addQuestion.style.display = "none";
        viewMCQ.style.display = viewQuestion.style.display = "none";
        course.style.display = "none";
        for (let i = 1; i < childrenLength; i++) {
          sideNavigationItems[i].style.display = "none";
        }
      }
      if (isCoursesPage) {
        course.style.display = "none";
        addCourse.style.display = "block";
      }
      aboutUs.style.display = help.style.display = contactUs.style.display = logIn.style.display =
        "none";
      for (let i = 1; i < moreItemsContainer.children.length; i++) {
        moreItemsContainer.children[i].style.display = "none";
      }
      if (addCourse.style.display) {
        addCourse.style.display = "";
        removeCourse.style.display = "";
      } else {
        addCourse.style.display = "none";
        removeCourse.style.display = "none";
      }
      if (addMCQ.style.display !== "none") {
        exploreContainer.style.display = "none";
        addContainer.style.display = "none";
        courseContainer.style.display = "none";
      }
    }

    //disable links if href and window location is same for side navigation links
    for (let i = 0; i < sideNavigationItems.length; i++) {
      sideNavigationItems[i].addEventListener("click", (e) => {
        let url = window.location.href;
        let mcqIndex = -1;
        let subIndex = -1;
        let newIndex = -1;
        mcqIndex = url.indexOf("/mcq");
        subIndex = url.indexOf("/sub");
        newIndex = url.indexOf("new");
        if (mcqIndex !== -1 && newIndex === -1) {
          url = url.substr(0, mcqIndex + 4 + 1);
          if (url === e.target.href) {
            e.preventDefault();
          }
        } else if (subIndex !== -1 && newIndex === -1) {
          url = url.substr(0, subIndex + 4 + 1);
          if (url === e.target.href) {
            e.preventDefault();
          }
        } else {
          if (
            e.target.href === window.location.href ||
            e.target.href + "home" === window.location.href ||
            e.target.href + "/" === window.location.href //for course/
          )
            e.preventDefault();
        }
      });
    }
  }

  {
    const profilePage = document.getElementsByClassName("profile_page");

    for (let i = 0; i < profilePage.length; i++) {
      if (isHomePage || areAdditionalPages || isLogin)
        profilePage[i].parentNode.style.display = "none";

      profilePage[i].addEventListener("touchstart", function (e) {
        if (window.location.href === e.target.parentNode.href)
          e.preventDefault();
        e.target.style.boxShadow = "none";
      });

      profilePage[i].addEventListener("touchend", function (e) {
        e.target.style.boxShadow = "0 0 10px 2px #ffffff";
      });

      profilePage[i].addEventListener("mouseenter", function (e) {
        e.target.firstElementChild.style.boxShadow = "";
      });

      profilePage[i].addEventListener("click", function (e) {
        if (window.location.href === e.target.parentNode.href)
          e.preventDefault();
      });
    }
  }

  {
    const topNavigationItems = document.getElementsByClassName(
      "top_navigation_items"
    );
    if (isHomePage || areAdditionalPages) {
      topNavigationItems[5].parentNode.parentNode.style.display = "none";
      topNavigationItems[1].style.display = topNavigationItems[9].style.display =
        "none";
    } else if (isLogin) {
      topNavigationItems[5].parentNode.parentNode.style.display = "none";
      topNavigationItems[1].style.display = topNavigationItems[9].style.display = topNavigationItems[8].style.display =
        "none";
    } else {
      topNavigationItems[2].style.display = topNavigationItems[3].style.display = topNavigationItems[8].style.display = topNavigationItems[4].style.display =
        "none";
    }
    //disable links if href and window location is same for top navigation links
    for (let i = 0; i < topNavigationItems.length; i++) {
      topNavigationItems[i].addEventListener("click", function (e) {
        if (
          e.target.parentNode.href === window.location.href ||
          e.target.parentNode.href + "home" === window.location.href ||
          e.target.parentNode.href + "/" === window.location.href //for course/
        )
          e.preventDefault();
      });
    }
  }
}
{
  const logo = document.getElementsByClassName("logo");
  for (let i = 0; i < logo.length; i++) {
    logo[i].addEventListener("click", function (e) {
      if (
        e.target.parentNode.href === window.location.href ||
        e.target.parentNode.href + "home" === window.location.href
      )
        e.preventDefault();
    });
  }
}

{
  let startX = 0;
  let startY = 0;
  let flag = false;
  const dropdownContainer = document.getElementsByClassName(
    "dropdown_container"
  )[0];
  const dropdownTitle = dropdownContainer.firstElementChild;

  dropdownContainer.addEventListener("mouseleave", function (e) {
    const target = e.target;
    const classList = dropdownTitle.lastElementChild.classList;
    classList.remove("fa-caret-up");
    classList.add("fa-caret-down");
    target.lastElementChild.style.display = "";
  });

  dropdownTitle.addEventListener("touchstart", function (e) {
    let touchObj = {};
    touchObj = e.changedTouches[0];
    startX = touchObj.pageX;
    startY = touchObj.pageY;
  });

  dropdownTitle.addEventListener("touchmove", function (e) {
    let touchObj = {};
    touchObj = e.changedTouches[0];
    if (
      !(Math.abs(touchObj.pageX - startX) <= 10) ||
      !(Math.abs(touchObj.pageY - startY) <= 10)
    )
      flag = true;
  });

  dropdownTitle.addEventListener("touchend", function (e) {
    let touchObj = {};
    let target = {};
    let dropdownItemsContainer = {};
    let classList = {};
    let display = "";
    touchObj = e.changedTouches[0];
    e.preventDefault();
    try {
      target = touchObj.target;
      if (
        !(Math.abs(touchObj.pageX - startX) <= 10) ||
        !(Math.abs(touchObj.pageY - startY) <= 10)
      )
        return;
    } catch (e) {
      target = dropdownTitle;
      if (flag) return;
    } finally {
      dropdownItemsContainer = target.nextElementSibling;
      display = window
        .getComputedStyle(dropdownItemsContainer)
        .getPropertyValue("display");
      classList = target.lastElementChild.classList;
      if (display === "block") {
        dropdownItemsContainer.style.display = "none";
        classList.remove("fa-caret-up");
        classList.add("fa-caret-down");
      } else {
        dropdownItemsContainer.style.display = "block";
        classList.remove("fa-caret-down");
        classList.add("fa-caret-up");
      }
    }
  });
}

{
  const footerLinks = document.getElementsByClassName("fl");
  for (let i = 0; i < footerLinks.length; i++) {
    footerLinks[i].addEventListener("click", (e) => {
      if (
        e.target.href === window.location.href ||
        e.target.href + "home" === window.location.href
      )
        e.preventDefault();
    });
  }
}
{
  function handleQuestionNav(e) {
    let target = {};
    let classList = {};
    let children = {};
    if (Array.from(e.target.classList).includes("fa"))
      target = e.target.parentNode;
    else target = e.target;
    classList = target.lastElementChild.classList;
    children = target.parentNode.children;
    if (
      Array.from(target.lastElementChild.classList).includes("fa-caret-down")
    ) {
      for (let i = 1; i < children.length; i++) {
        children[i].style.display = "block";
      }
      classList.remove("fa-caret-down");
      classList.add("fa-caret-up");
    } else {
      for (let i = 1; i < children.length; i++) {
        children[i].style.display = "none";
      }
      classList.remove("fa-caret-up");
      classList.add("fa-caret-down");
    }
  }
  {
    const dropdownTitle = document.getElementById("explore_container")
      .firstElementChild;

    dropdownTitle.addEventListener("click", handleQuestionNav);
  }
  {
    const dropdownTitle = document.getElementById("add_container")
      .firstElementChild;

    dropdownTitle.addEventListener("click", handleQuestionNav);
  }
  {
    const dropdownTitle = document.getElementsByClassName(
      "dropdown_container_2"
    )[0].firstElementChild;

    dropdownTitle.addEventListener("click", handleQuestionNav);
  }
  {
    const dropdownTitle = document.getElementById("course_container")
      .firstElementChild;
    dropdownTitle.addEventListener("click", handleQuestionNav);
  }
}
{
  const flash = document.getElementsByClassName("flashes_question")[0];
  if (flash) {
    document.body.style.overflowY = "hidden";
    document.getElementById("opacity_container").style.display = "block";
    setTimeout(() => {
      flash.style.display = "none";
      document.body.style.overflowY = "";
      document.getElementById("opacity_container").style.display = "";
    }, 1000);
  }
}
