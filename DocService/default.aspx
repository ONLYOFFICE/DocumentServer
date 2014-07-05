<%@ Page Language="C#" %>
<script runat="server">
  protected override void OnLoad(EventArgs e)
  {
      Response.Redirect(ConfigurationSettings.AppSettings["DefaultURL"]);
      base.OnLoad(e);
  }
</script>

