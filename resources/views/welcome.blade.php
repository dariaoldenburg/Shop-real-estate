<!doctype html>
<html lang="{{ config('app.locale') }}">
<head>
    <meta charset="utf-8">
    <title>Shop Real Estate</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
    {{--<link href="css/custom.css" rel="stylesheet" type="text/css"/>--}}
    <link href="css/all.css" rel="stylesheet" type="text/css"/>
    <link href='http://fonts.googleapis.com/css?family=Lato:300,400%7CRaleway:100,400,300,500,600,700%7COpen+Sans:400,500,600' rel='stylesheet' type='text/css'>
</head>
<body ng-app="application">
    <main class="main-container" ng-controller="AppController">
        <ui-view></ui-view>
    </main>


    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

    <script src="js/angular.min.js"></script>
    <script src="js/angular-ui-router.min-1-0-3.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/satellizer/0.14.1/satellizer.js"></script>
    <script src="https://cdn.rawgit.com/alertifyjs/alertify.js/v1.0.10/dist/js/ngAlertify.js"></script>

    <script src="js/all.js"></script>
</body>
</html>
