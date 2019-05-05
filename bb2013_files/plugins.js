/* Set the defaults for DataTables initialisation */
$.extend( true, $.fn.dataTable.defaults, {
	"sDom": "<'row'<'col-sm-12'<'pull-right'f><'pull-left'l>r<'clearfix'>>>t<'row'<'col-sm-12'<'pull-left'i><'pull-right'p><'clearfix'>>>",
    "sPaginationType": "bs_normal",
    "oLanguage": {
        "sLengthMenu": "Show _MENU_ Rows",
        "sSearch": ""
    }
} );

/* Default class modification */
$.extend( $.fn.dataTableExt.oStdClasses, {
	"sWrapper": "dataTables_wrapper form-inline"
} );

/* API method to get paging information */
$.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings )
{
	return {
		"iStart":         oSettings._iDisplayStart,
		"iEnd":           oSettings.fnDisplayEnd(),
		"iLength":        oSettings._iDisplayLength,
		"iTotal":         oSettings.fnRecordsTotal(),
		"iFilteredTotal": oSettings.fnRecordsDisplay(),
		"iPage":          oSettings._iDisplayLength === -1 ?
			0 : Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
		"iTotalPages":    oSettings._iDisplayLength === -1 ?
			0 : Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
	};
};

/* Bootstrap style pagination control */
$.extend( $.fn.dataTableExt.oPagination, {
	"bs_normal": {
		"fnInit": function( oSettings, nPaging, fnDraw ) {
			var oLang = oSettings.oLanguage.oPaginate;
			var fnClickHandler = function ( e ) {
				e.preventDefault();
				if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
					fnDraw( oSettings );
				}
			};
			$(nPaging).append(
				'<ul class="pagination">'+
					'<li class="prev disabled"><a href="#"><span class="glyphicon glyphicon-chevron-left"></span>&nbsp;'+oLang.sPrevious+'</a></li>'+
					'<li class="next disabled"><a href="#">'+oLang.sNext+'&nbsp;<span class="glyphicon glyphicon-chevron-right"></span></a></li>'+
				'</ul>'
			);
			var els = $('a', nPaging);
			$(els[0]).bind( 'click.DT', { action: "previous" }, fnClickHandler );
			$(els[1]).bind( 'click.DT', { action: "next" }, fnClickHandler );
		},
		"fnUpdate": function ( oSettings, fnDraw ) {
			var iListLength = 5;
			var oPaging = oSettings.oInstance.fnPagingInfo();
			var an = oSettings.aanFeatures.p;
			var i, ien, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);
			if ( oPaging.iTotalPages < iListLength) {
				iStart = 1;
				iEnd = oPaging.iTotalPages;
			}
			else if ( oPaging.iPage <= iHalf ) {
				iStart = 1;
				iEnd = iListLength;
			} else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
				iStart = oPaging.iTotalPages - iListLength + 1;
				iEnd = oPaging.iTotalPages;
			} else {
				iStart = oPaging.iPage - iHalf + 1;
				iEnd = iStart + iListLength - 1;
			}
			for ( i=0, ien=an.length ; i<ien ; i++ ) {
				$('li:gt(0)', an[i]).filter(':not(:last)').remove();
				for ( j=iStart ; j<=iEnd ; j++ ) {
					sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
					$('<li '+sClass+'><a href="#">'+j+'</a></li>')
						.insertBefore( $('li:last', an[i])[0] )
						.bind('click', function (e) {
							e.preventDefault();
							oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
							fnDraw( oSettings );
						} );
				}
				if ( oPaging.iPage === 0 ) {
					$('li:first', an[i]).addClass('disabled');
				} else {
					$('li:first', an[i]).removeClass('disabled');
				}

				if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
					$('li:last', an[i]).addClass('disabled');
				} else {
					$('li:last', an[i]).removeClass('disabled');
				}
			}
		}
	},	
	"bs_two_button": {
		"fnInit": function ( oSettings, nPaging, fnCallbackDraw )
		{
			var oLang = oSettings.oLanguage.oPaginate;
			var oClasses = oSettings.oClasses;
			var fnClickHandler = function ( e ) {
				if ( oSettings.oApi._fnPageChange( oSettings, e.data.action ) )
				{
					fnCallbackDraw( oSettings );
				}
			};
			var sAppend = '<ul class="pagination">'+
				'<li class="prev"><a class="'+oSettings.oClasses.sPagePrevDisabled+'" tabindex="'+oSettings.iTabIndex+'" role="button"><span class="glyphicon glyphicon-chevron-left"></span>&nbsp;'+oLang.sPrevious+'</a></li>'+
				'<li class="next"><a class="'+oSettings.oClasses.sPageNextDisabled+'" tabindex="'+oSettings.iTabIndex+'" role="button">'+oLang.sNext+'&nbsp;<span class="glyphicon glyphicon-chevron-right"></span></a></li>'+
				'</ul>';
			$(nPaging).append( sAppend );
			var els = $('a', nPaging);
			var nPrevious = els[0],
				nNext = els[1];
			oSettings.oApi._fnBindAction( nPrevious, {action: "previous"}, fnClickHandler );
			oSettings.oApi._fnBindAction( nNext,     {action: "next"},     fnClickHandler );
			if ( !oSettings.aanFeatures.p )
			{
				nPaging.id = oSettings.sTableId+'_paginate';
				nPrevious.id = oSettings.sTableId+'_previous';
				nNext.id = oSettings.sTableId+'_next';
				nPrevious.setAttribute('aria-controls', oSettings.sTableId);
				nNext.setAttribute('aria-controls', oSettings.sTableId);
			}
		},
		"fnUpdate": function ( oSettings, fnCallbackDraw )
		{
			if ( !oSettings.aanFeatures.p )
			{
				return;
			}
			var oPaging = oSettings.oInstance.fnPagingInfo();
			var oClasses = oSettings.oClasses;
			var an = oSettings.aanFeatures.p;
			var nNode;
			for ( var i=0, iLen=an.length ; i<iLen ; i++ )
			{
				if ( oPaging.iPage === 0 ) {
					$('li:first', an[i]).addClass('disabled');
				} else {
					$('li:first', an[i]).removeClass('disabled');
				}

				if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
					$('li:last', an[i]).addClass('disabled');
				} else {
					$('li:last', an[i]).removeClass('disabled');
				}
			}
		}
	},
	"bs_four_button": {
		"fnInit": function ( oSettings, nPaging, fnCallbackDraw )
			{
				var oLang = oSettings.oLanguage.oPaginate;
				var oClasses = oSettings.oClasses;
				var fnClickHandler = function ( e ) {
					if ( oSettings.oApi._fnPageChange( oSettings, e.data.action ) )
					{
						fnCallbackDraw( oSettings );
					}
				};
				$(nPaging).append(
					'<ul class="pagination">'+
					'<li class="disabled"><a  tabindex="'+oSettings.iTabIndex+'" class="'+oClasses.sPageButton+" "+oClasses.sPageFirst+'"><span class="glyphicon glyphicon-backward"></span>&nbsp;'+oLang.sFirst+'</a></li>'+
					'<li class="disabled"><a  tabindex="'+oSettings.iTabIndex+'" class="'+oClasses.sPageButton+" "+oClasses.sPagePrevious+'"><span class="glyphicon glyphicon-chevron-left"></span>&nbsp;'+oLang.sPrevious+'</a></li>'+
					'<li><a tabindex="'+oSettings.iTabIndex+'" class="'+oClasses.sPageButton+" "+oClasses.sPageNext+'">'+oLang.sNext+'&nbsp;<span class="glyphicon glyphicon-chevron-right"></span></a></li>'+
					'<li><a tabindex="'+oSettings.iTabIndex+'" class="'+oClasses.sPageButton+" "+oClasses.sPageLast+'">'+oLang.sLast+'&nbsp;<span class="glyphicon glyphicon-forward"></span></a></li>'+
					'</ul>'
				);
				var els = $('a', nPaging);
				var nFirst = els[0],
					nPrev = els[1],
					nNext = els[2],
					nLast = els[3];
				oSettings.oApi._fnBindAction( nFirst, {action: "first"},    fnClickHandler );
				oSettings.oApi._fnBindAction( nPrev,  {action: "previous"}, fnClickHandler );
				oSettings.oApi._fnBindAction( nNext,  {action: "next"},     fnClickHandler );
				oSettings.oApi._fnBindAction( nLast,  {action: "last"},     fnClickHandler );
				if ( !oSettings.aanFeatures.p )
				{
					nPaging.id = oSettings.sTableId+'_paginate';
					nFirst.id =oSettings.sTableId+'_first';
					nPrev.id =oSettings.sTableId+'_previous';
					nNext.id =oSettings.sTableId+'_next';
					nLast.id =oSettings.sTableId+'_last';
				}
			},
		"fnUpdate": function ( oSettings, fnCallbackDraw )
			{
				if ( !oSettings.aanFeatures.p )
				{
					return;
				}
				var oPaging = oSettings.oInstance.fnPagingInfo();
				var oClasses = oSettings.oClasses;
				var an = oSettings.aanFeatures.p;
				var nNode;
				for ( var i=0, iLen=an.length ; i<iLen ; i++ )
				{
					if ( oPaging.iPage === 0 ) {
						$('li:eq(0)', an[i]).addClass('disabled');
						$('li:eq(1)', an[i]).addClass('disabled');
					} else {
						$('li:eq(0)', an[i]).removeClass('disabled');
						$('li:eq(1)', an[i]).removeClass('disabled');
					}

					if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
						$('li:eq(2)', an[i]).addClass('disabled');
						$('li:eq(3)', an[i]).addClass('disabled');
					} else {
						$('li:eq(2)', an[i]).removeClass('disabled');
						$('li:eq(3)', an[i]).removeClass('disabled');
					}
				}
			}
	},
	"bs_full": {
		"fnInit": function ( oSettings, nPaging, fnCallbackDraw )
			{
				var oLang = oSettings.oLanguage.oPaginate;
				var oClasses = oSettings.oClasses;
				var fnClickHandler = function ( e ) {
					if ( oSettings.oApi._fnPageChange( oSettings, e.data.action ) )
					{
						fnCallbackDraw( oSettings );
					}
				};
				$(nPaging).append(
					'<ul class="pagination">'+
					'<li class="disabled"><a  tabindex="'+oSettings.iTabIndex+'" class="'+oClasses.sPageButton+" "+oClasses.sPageFirst+'">'+oLang.sFirst+'</a></li>'+
					'<li class="disabled"><a  tabindex="'+oSettings.iTabIndex+'" class="'+oClasses.sPageButton+" "+oClasses.sPagePrevious+'">'+oLang.sPrevious+'</a></li>'+
					'<li><a tabindex="'+oSettings.iTabIndex+'" class="'+oClasses.sPageButton+" "+oClasses.sPageNext+'">'+oLang.sNext+'</a></li>'+
					'<li><a tabindex="'+oSettings.iTabIndex+'" class="'+oClasses.sPageButton+" "+oClasses.sPageLast+'">'+oLang.sLast+'</a></li>'+
					'</ul>'
				);
				var els = $('a', nPaging);
				var nFirst = els[0],
					nPrev = els[1],
					nNext = els[2],
					nLast = els[3];
				oSettings.oApi._fnBindAction( nFirst, {action: "first"},    fnClickHandler );
				oSettings.oApi._fnBindAction( nPrev,  {action: "previous"}, fnClickHandler );
				oSettings.oApi._fnBindAction( nNext,  {action: "next"},     fnClickHandler );
				oSettings.oApi._fnBindAction( nLast,  {action: "last"},     fnClickHandler );
				if ( !oSettings.aanFeatures.p )
				{
					nPaging.id = oSettings.sTableId+'_paginate';
					nFirst.id =oSettings.sTableId+'_first';
					nPrev.id =oSettings.sTableId+'_previous';
					nNext.id =oSettings.sTableId+'_next';
					nLast.id =oSettings.sTableId+'_last';
				}
			},
		"fnUpdate": function ( oSettings, fnCallbackDraw )
			{
				if ( !oSettings.aanFeatures.p )
				{
					return;
				}
				var oPaging = oSettings.oInstance.fnPagingInfo();
				var iPageCount = $.fn.dataTableExt.oPagination.iFullNumbersShowPages;
				var iPageCountHalf = Math.floor(iPageCount / 2);
				var iPages = Math.ceil((oSettings.fnRecordsDisplay()) / oSettings._iDisplayLength);
				var iCurrentPage = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength) + 1;
				var sList = "";
				var iStartButton, iEndButton, i, iLen;
				var oClasses = oSettings.oClasses;
				var anButtons, anStatic, nPaginateList, nNode;
				var an = oSettings.aanFeatures.p;
				var fnBind = function (j) {
					oSettings.oApi._fnBindAction( this, {"page": j+iStartButton-1}, function(e) {
						oSettings.oApi._fnPageChange( oSettings, e.data.page );
						fnCallbackDraw( oSettings );
						e.preventDefault();
					} );
				};
				if ( oSettings._iDisplayLength === -1 )
				{
					iStartButton = 1;
					iEndButton = 1;
					iCurrentPage = 1;
				}
				else if (iPages < iPageCount)
				{
					iStartButton = 1;
					iEndButton = iPages;
				}
				else if (iCurrentPage <= iPageCountHalf)
				{
					iStartButton = 1;
					iEndButton = iPageCount;
				}
				else if (iCurrentPage >= (iPages - iPageCountHalf))
				{
					iStartButton = iPages - iPageCount + 1;
					iEndButton = iPages;
				}
				else
				{
					iStartButton = iCurrentPage - Math.ceil(iPageCount / 2) + 1;
					iEndButton = iStartButton + iPageCount - 1;
				}
				for ( i=iStartButton ; i<=iEndButton ; i++ )
				{
					sList += (iCurrentPage !== i) ?
						'<li><a tabindex="'+oSettings.iTabIndex+'">'+oSettings.fnFormatNumber(i)+'</a></li>' :
						'<li class="active"><a tabindex="'+oSettings.iTabIndex+'">'+oSettings.fnFormatNumber(i)+'</a></li>';
				}
				for ( i=0, iLen=an.length ; i<iLen ; i++ )
				{
					nNode = an[i];
					if ( !nNode.hasChildNodes() )
					{
						continue;
					}
					$('li:gt(1)', an[i]).filter(':not(li:eq(-2))').filter(':not(li:eq(-1))').remove();
					if ( oPaging.iPage === 0 ) {
						$('li:eq(0)', an[i]).addClass('disabled');
						$('li:eq(1)', an[i]).addClass('disabled');
					} else {
						$('li:eq(0)', an[i]).removeClass('disabled');
						$('li:eq(1)', an[i]).removeClass('disabled');
					}
					if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
						$('li:eq(-1)', an[i]).addClass('disabled');
						$('li:eq(-2)', an[i]).addClass('disabled');
					} else {
						$('li:eq(-1)', an[i]).removeClass('disabled');
						$('li:eq(-2)', an[i]).removeClass('disabled');
					}
					$(sList)
						.insertBefore('li:eq(-2)', an[i])
						.bind('click', function (e) {
							e.preventDefault();
							oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
							fnCallbackDraw( oSettings );
						});
				}
			}
	}	
} );


/*
 * TableTools Bootstrap compatibility
 * Required TableTools 2.1+
 */
if ( $.fn.DataTable.TableTools ) {
	// Set the classes that TableTools uses to something suitable for Bootstrap
	$.extend( true, $.fn.DataTable.TableTools.classes, {
		"container": "DTTT btn-group",
		"buttons": {
			"normal": "btn",
			"disabled": "disabled"
		},
		"collection": {
			"container": "DTTT_dropdown dropdown-menu",
			"buttons": {
				"normal": "",
				"disabled": "disabled"
			}
		},
		"print": {
			"info": "DTTT_print_info modal"
		},
		"select": {
			"row": "active"
		}
	} );

	// Have the collection use a bootstrap compatible dropdown
	$.extend( true, $.fn.DataTable.TableTools.DEFAULTS.oTags, {
		"collection": {
			"container": "ul",
			"button": "li",
			"liner": "a"
		}
	} );
}
window.bootbox=window.bootbox||function e(t,n){"use strict";function u(e){var t=y[s.locale];return t?t[e]:y.en[e]}function a(e,n,r){e.preventDefault();var i=t.isFunction(r)&&r(e)===!1;i||n.modal("hide")}function f(e){var t,n=0;for(t in e)n++;return n}function l(e,n){var r=0;t.each(e,function(e,t){n(e,t,r++)})}function c(e){var n,r;if(typeof e!="object")throw new Error("Please supply an object of options");if(!e.message)throw new Error("Please specify a message");return e=t.extend({},s,e),e.buttons||(e.buttons={}),e.backdrop=e.backdrop?"static":!1,n=e.buttons,r=f(n),l(n,function(e,i,s){t.isFunction(i)&&(i=n[e]={callback:i});if(t.type(i)!=="object")throw new Error("button with key "+e+" must be an object");i.label||(i.label=e),i.className||(r<=2&&s===r-1?i.className="btn-primary":i.className="btn-default")}),e}function h(e,t){var n=e.length,r={};if(n<1||n>2)throw new Error("Invalid argument length");return n===2||typeof e[0]=="string"?(r[t[0]]=e[0],r[t[1]]=e[1]):r=e[0],r}function p(e,n,r){return t.extend(!0,{},e,h(n,r))}function d(e,t,n){return g(p(m.apply(null,e),t,n),e)}function v(){var e={};for(var t=0,n=arguments.length;t<n;t++){var r=arguments[t],i=r.toLowerCase(),s=r.toUpperCase();e[i]={label:u(s)}}return e}function m(){return{buttons:v.apply(null,arguments)}}function g(e,t){var r={};return l(t,function(e,t){r[t]=!0}),l(e.buttons,function(e){if(r[e]===n)throw new Error("button key "+e+" is not allowed (options are "+t.join("\n")+")")}),e}var r={dialog:"<div class='bootbox modal' tabindex='-1' role='dialog'><div class='modal-dialog'><div class='modal-content'><div class='modal-body'><div class='bootbox-body'></div></div></div></div></div>",header:"<div class='modal-header'><h4 class='modal-title'></h4></div>",footer:"<div class='modal-footer'></div>",closeButton:"<button type='button' class='bootbox-close-button close'>&times;</button>",form:"<form class='bootbox-form'></form>",inputs:{text:"<input class='bootbox-input bootbox-input-text form-control' autocomplete=off type=text />",email:"<input class='bootbox-input bootbox-input-email form-control' autocomplete='off' type='email' />",select:"<select class='bootbox-input bootbox-input-select form-control'></select>",checkbox:"<div class='checkbox'><label><input class='bootbox-input bootbox-input-checkbox' type='checkbox' /></label></div>"}},i=t("body"),s={locale:"en",backdrop:!0,animate:!0,className:null,closeButton:!0,show:!0},o={};o.alert=function(){var e;e=d(["ok"],arguments,["message","callback"]);if(e.callback&&!t.isFunction(e.callback))throw new Error("alert requires callback property to be a function when provided");return e.buttons.ok.callback=e.onEscape=function(){return t.isFunction(e.callback)?e.callback():!0},o.dialog(e)},o.confirm=function(){var e;e=d(["cancel","confirm"],arguments,["message","callback"]),e.buttons.cancel.callback=e.onEscape=function(){return e.callback(!1)},e.buttons.confirm.callback=function(){return e.callback(!0)};if(!t.isFunction(e.callback))throw new Error("confirm requires a callback");return o.dialog(e)},o.prompt=function(){var e,i,s,u,a,f,c;u=t(r.form),i={buttons:v("cancel","confirm"),value:"",inputType:"text"},e=g(p(i,arguments,["title","callback"]),["cancel","confirm"]),f=e.show===n?!0:e.show,e.message=u,e.buttons.cancel.callback=e.onEscape=function(){return e.callback(null)},e.buttons.confirm.callback=function(){var n;switch(e.inputType){case"text":case"email":case"select":n=a.val();break;case"checkbox":var r=a.find("input:checked");n=[],l(r,function(e,r){n.push(t(r).val())})}return e.callback(n)},e.show=!1;if(!e.title)throw new Error("prompt requires a title");if(!t.isFunction(e.callback))throw new Error("prompt requires a callback");if(!r.inputs[e.inputType])throw new Error("invalid prompt type");a=t(r.inputs[e.inputType]);switch(e.inputType){case"text":case"email":a.val(e.value);break;case"select":c=e.inputOptions||[];if(!c.length)throw new Error("prompt with select requires options");if(!c[0].value||!c[0].text)throw new Error("given options in wrong format");l(c,function(e,t){a.append("<option value='"+t.value+"'>"+t.text+"</option>")}),a.val(e.value);break;case"checkbox":var h=t.isArray(e.value)?e.value:[e.value];c=e.inputOptions||[];if(!c.length)throw new Error("prompt with checkbox requires options");if(!c[0].value||!c[0].text)throw new Error("given options in wrong format");a=t("<div/>"),l(c,function(n,i){var s=t(r.inputs[e.inputType]);s.find("input").attr("value",i.value),s.find("label").append(i.text),l(h,function(e,t){t===i.value&&s.find("input").prop("checked",!0)}),a.append(s)})}return e.placeholder&&a.attr("placeholder",e.placeholder),u.append(a),u.on("submit",function(e){e.preventDefault(),s.find(".btn-primary").click()}),s=o.dialog(e),s.off("shown.bs.modal"),s.on("shown.bs.modal",function(){a.focus()}),f===!0&&s.modal("show"),s},o.dialog=function(e){e=c(e);var n=t(r.dialog),s=n.find(".modal-body"),o=e.buttons,u="",f={onEscape:e.onEscape};l(o,function(e,t){u+="<button data-bb-handler='"+e+"' type='button' class='btn "+t.className+"'>"+t.label+"</button>",f[e]=t.callback}),s.find(".bootbox-body").html(e.message),e.animate===!0&&n.addClass("fade"),e.className&&n.addClass(e.className),e.title&&s.before(r.header);if(e.closeButton){var h=t(r.closeButton);e.title?n.find(".modal-header").prepend(h):h.css("margin-top","-10px").prependTo(s)}return e.title&&n.find(".modal-title").html(e.title),u.length&&(s.after(r.footer),n.find(".modal-footer").html(u)),n.on("hidden.bs.modal",function(e){e.target===this&&n.remove()}),n.on("shown.bs.modal",function(){n.find(".btn-primary:first").focus()}),n.on("escape.close.bb",function(e){f.onEscape&&a(e,n,f.onEscape)}),n.on("click",".modal-footer button",function(e){var r=t(this).data("bb-handler");a(e,n,f[r])}),n.on("click",".bootbox-close-button",function(e){a(e,n,f.onEscape)}),n.on("keyup",function(e){e.which===27&&n.trigger("escape.close.bb")}),i.append(n),n.modal({backdrop:e.backdrop,keyboard:!1,show:!1}),e.show&&n.modal("show"),n},o.setDefaults=function(){var e={};arguments.length===2?e[arguments[0]]=arguments[1]:arguments.length===1&&(e=arguments[0]),t.extend(s,e)},o.hideAll=function(){t(".bootbox").modal("hide")};var y={br:{OK:"OK",CANCEL:"Cancelar",CONFIRM:"Sim"},da:{OK:"OK",CANCEL:"Annuller",CONFIRM:"Accepter"},de:{OK:"OK",CANCEL:"Abbrechen",CONFIRM:"Akzeptieren"},en:{OK:"OK",CANCEL:"Cancel",CONFIRM:"OK"},es:{OK:"OK",CANCEL:"Cancelar",CONFIRM:"Aceptar"},fi:{OK:"OK",CANCEL:"Peruuta",CONFIRM:"OK"},fr:{OK:"OK",CANCEL:"Annuler",CONFIRM:"D'accord"},it:{OK:"OK",CANCEL:"Annulla",CONFIRM:"Conferma"},nl:{OK:"OK",CANCEL:"Annuleren",CONFIRM:"Accepteren"},no:{OK:"OK",CANCEL:"Avbryt",CONFIRM:"OK"},pl:{OK:"OK",CANCEL:"Anuluj",CONFIRM:"Potwierdź"},ru:{OK:"OK",CANCEL:"Отмена",CONFIRM:"Применить"},zh_CN:{OK:"OK",CANCEL:"取消",CONFIRM:"确认"},zh_TW:{OK:"OK",CANCEL:"取消",CONFIRM:"確認"}};return o.init=function(n){window.bootbox=e(n||t)},o}(window.jQuery);/**
 * @author dann toliver
 * @requires jQuery
 */

var jDaimio = {
  metadata: []
}

// TODO: make this better
var scr=document.getElementsByTagName('script');
var src=scr[scr.length-1].getAttribute("src");


jDaimio.loadMetadata = function() {
  jDaimio.process(
    "{myself fetch_metadata}",
    function(result) {
      jDaimio.metadata = response;
      $(document).trigger('load_metadata.jDaimio');
  });
}

jDaimio.fetchMetadata = function(key, callback) {
  jDaimio.process(
    "{myself fetch_metadata key #key}",
    {key: key},
    callback
  );
}


jDaimio.setMetadata = function(key, value) {
  jDaimio.metadata[key] = [value];
  jDaimio.process(
    "{myself set_metadata key #key value #value}",
    {key: key, value: value}
  );
}

jDaimio.removeMetadata = function(key) {
  delete jDaimio.metadata[key];
  jDaimio.process(
    "{myself remove_metadata key #key}",
    {key: key}
  );
}


jDaimio.process = function(commands, vars, callback) {
  post_data = {commands: commands};

  if(typeof(vars) == 'function') {
    callback = vars;
  } else {
    jQuery.extend(post_data, vars);
  }
  
  $.post(src + "/../../hermes.php", 
    post_data,
    function(response) {
      jDaimio.logStuff(response);
      if(typeof(callback) == 'function') {
        callback(response.results, response, vars);
      }
    },
    'json'
  );
}


jQuery.fn.daimioLoad = function(commands, vars) {
  post_data = {commands: commands};
  jQuery.extend(post_data, vars);
  var $this = this;

  $.post(src + "/../../hermes.php", 
    post_data,
    function(response) {
      jDaimio.logStuff(response);
      $this.each(function() {
        $(this).html(response.results);
      });
    },
    'json'
  );

  return this;
};


jQuery.fn.daimioSubmit = function(callback) {
  var $this = this;
  var post_data = $this.serialize();

  $.post(src + "/../../hermes.php", 
    post_data,
    function(response) {
      jDaimio.logStuff(response);
      if(typeof(callback) == 'function') {
        callback(response.results, response);
      }
    },
    'json'
  );

  return this;
};


jDaimio.logStuff = function(response) {
  if(response.notices) {
    console.log('notice', response.notices);
  }
  if(response.warnings) {
    console.log('warning', response.warnings);
  }
  if(response.errors) {
    console.log('error', response.errors);
  }
}


/*
     FILE ARCHIVED ON 21:11:46 Mar 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 02:20:23 May 05, 2019.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  LoadShardBlock: 277.054 (3)
  esindex: 0.008
  captures_list: 298.218
  CDXLines.iter: 15.82 (3)
  PetaboxLoader3.datanode: 170.913 (4)
  exclusion.robots: 0.178
  exclusion.robots.policy: 0.164
  RedisCDXSource: 1.805
  PetaboxLoader3.resolve: 177.117 (2)
  load_resource: 153.177
*/