using System.Web.Optimization;

namespace OnlineEditorsExampleMVC
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-{version}.js",
                "~/Scripts/jquery-ui.js",
                "~/Scripts/jquery.blockUI.js",
                "~/Scripts/jquery.iframe-transport.js",
                "~/Scripts/jquery.fileupload.js",
                "~/Scripts/jquery.dropdownToggle.js"
                            ));

            bundles.Add(new ScriptBundle("~/bundles/scripts").Include(
                "~/Scripts/jscript.js"
                            ));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/stylesheet.css",
                "~/Content/jquery-ui.css"
                            ));

            bundles.Add(new StyleBundle("~/Content/editor").Include(
                "~/Content/editor.css"
                            ));
        }
    }
}