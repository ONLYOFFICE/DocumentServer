using System.Web.Mvc;
using OnlineEditorsExampleMVC.Helpers;
using OnlineEditorsExampleMVC.Models;

namespace OnlineEditorsExampleMVC.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Editor(string fileName, string mode)
        {
            mode = mode ?? string.Empty;

            var file = new FileModel
            {
                TypeDesktop = mode != "embedded",
                FileName = fileName
            };

            return View("Editor", file);
        }

        public ActionResult Sample(string fileExt)
        {
            var fileName = DocManagerHelper.CreateDemo(fileExt);
            Response.Redirect(Url.Action("Editor", "Home", new { fileName = fileName }));
            return null;
        }
    }
}