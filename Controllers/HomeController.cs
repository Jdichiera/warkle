using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.IO;
using Newtonsoft.Json;




namespace JDichiera_webapp.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "About Us";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Contact Us";

            return View();
        }

        public IActionResult Error()
        {
            return View();
        }




    //    [HttpGet]
    //    public JsonResult Get()
    //    { 
    //        var url = "http://jdichieradiceapi.azurewebsites.net/api/dice";
    //        return Json(url, JsonRequestBehavior.AllowGet);
    //        //return die;
    //    }






    }
}
