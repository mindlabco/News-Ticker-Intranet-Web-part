import { SPComponentLoader } from '@microsoft/sp-loader';
import * as pnp from 'sp-pnp-js';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './NewsTickerWebpartWebPart.module.scss';
import * as strings from 'NewsTickerWebpartWebPartStrings';

export interface INewsTickerWebpartWebPartProps {
  description: string;
}
require('./app/style.css');
export default class NewsTickerWebpartWebPart extends BaseClientSideWebPart<INewsTickerWebpartWebPartProps> {

  public constructor() {
    super();
    SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css');
    SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');

    SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js', { globalExportsName: 'jQuery' }).then((jQuery: any): void => {
      SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js',  { globalExportsName: 'jQuery' }).then((): void => {  
        require('./app/ticker.js');      
      });
    });
  }

  public onInit(): Promise<void> {

    return super.onInit().then(_ => {
  
      pnp.setup({
        spfxContext: this.context
      });
      
    });
  }

  public getDataFromList():void {
    var mythis =this;
    pnp.sp.web.lists.getByTitle('NewsTicker').items.get().then(function(result){
      //console.log("Got List Data:"+JSON.stringify(result));
      mythis.displayData(result);
    },function(er){
      alert("Oops, Something went wrong, Please try after sometime");
      console.log("Error:"+er);
    });
  }


  public displayData(data):void{
    data.forEach(function(val){
      var title= val.Title;
      if(title.length > 85){
        title = title.substring(0,85)+'...';  
      }
      var myHtml = '<li class="js-item">'+title+'</li>';
        var div = document.getElementById("newsTicker");
        div.innerHTML+=myHtml;
    });
    
  }

  public render(): void {
    this.domElement.innerHTML = `
    <div class="row">
	<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
		<div class="card card-stats events-news">
			<div class="card-header1">Latest News</div>
			<div class="newsticker js-newsticker">
    <ul class="js-frame news-text" id="newsTicker">
        
    </ul>
</div>
		</div>
		<div class="panel-footer" style="text-align:center">
			<a class="footeranchor" href="/sites/Intranet/SPFX/Lists/NewsTicker/AllItems.aspx" target="_blank">VIEW ALL</a>
		</div>
	</div>
</div>`;

    this.getDataFromList();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
