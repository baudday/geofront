<div class="navbar navbar-static-top">
            <div class="navbar-inner">
                <div class="container">
                    <!-- Responsive Navbar Part 1: Button for triggering responsive navbar (not covered in tutorial). Include responsive CSS to utilize. -->
                    <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </a>
                    <a class="brand" href="">GeoRelief</a>
                    <!-- Responsive Navbar Part 2: Place all navbar contents you want collapsed withing .navbar-collapse.collapse. -->
                    <div class="nav-collapse collapse">
                        <ul class="nav">
                            <li class=""><a href="">Home</a></li>
                            <li><a class="menu-button" href="#/Map">Map</a></li>
                            <li><a class="menu-button" href="#/Institutions">Institutions</a></li>
                            <li><a class="menu-button" href="#/About">About</a></li>
                            <li><a class="menu-button" href="#/Contact">Contact</a></li>
                            <!-- Read about Bootstrap dropdowns at http://twitter.github.com/bootstrap/javascript.html#dropdowns -->
                            <!-- <li class="dropdown">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown <b class="caret"></b></a>
                                <ul class="dropdown-menu">
                                    <li><a href="#">Action</a></li>
                                    <li><a href="#">Another action</a></li>
                                    <li><a href="#">Something else here</a></li>
                                    <li class="divider"></li>
                                    <li class="nav-header">Nav header</li>
                                    <li><a href="#">Separated link</a></li>
                                    <li><a href="#">One more separated link</a></li>
                                </ul>
                            </li> -->
                        </ul>

                        <!-- Not logged in -->
                        <!-- The drop down menu -->
                        <ul class="nav pull-right">
                            <% if(localStorage.getItem('loggedIn')) { %>
                                <li>Welcome <%= localStorage.getItem('realname') %>!</li>
                            <%} else { %>
                                <li><a href="#/SignUp">Sign Up</a></li>
                                <li class="divider-vertical"></li>
                                <li><a href="#/SignIn">Sign In</a></li>
                            <% } %>
                        </ul>
                    </div><!--/.nav-collapse -->
                </div>
            </div><!-- /.navbar-inner -->
        </div><!-- /.navbar -->