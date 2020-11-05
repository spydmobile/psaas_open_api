# psaas_open_api
Provides an Open API - REST api for PSaaS Wildfire Modelling System.
this is integrated into the #psaas-open-api channel on the PSaaS Discord via webhook. This api is OpenAPI V3 Compliant and was built using Swagger Hub.

# Swagger 
We are using Open API 3.0 tools via swagger. The swagger branch container the head/leading edge of the API and an outdated version of the application. so stick eith master branch and done use the swagger branch.

# Basics

The elements provided by the Open API are NOT elements provided by the PSaaS JS API. These elements are meant to simplify the creation of PSaaS Models by introducing fundamental building blocks. Those building blocks are in draft below:

Templates - Templates are essentailly cookie cutter models. They are mostly predefined with minimal configurability. Templates will be the first element we expose via this API.

Ignitions - basically a point line or a polygon with a start date.

simple-station - a station/wx stream combo



