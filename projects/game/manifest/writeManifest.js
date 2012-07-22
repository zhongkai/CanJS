(function() {
	var console = {
		log: function (info) {
			WScript.StdOut.WriteLine(info);
		}
	};
	
	var fso = new ActiveXObject("Scripting.FileSystemObject");

	function readFileText(filename) {
		if (!fso.FileExists(filename)) return "";
		var adostream = new ActiveXObject("ADODB.Stream");
		adostream.Type = 2; //TextStreamType;
		adostream.Charset = "utf-8";
		adostream.Open();
		adostream.LoadFromFile(filename);
		var contents = adostream.ReadText();
		adostream.Close();
		adostream = null;
		return contents;
	}

	function writeFileText(filename, text) {
		console.log(["writeFileText:", filename].join(" "));
		var adostream = new ActiveXObject("ADODB.Stream");
		adostream.Type = 2; // TextStreamType;
		adostream.Charset = "utf-8";
		adostream.Open();
		adostream.WriteText(text);
		var adostream2 = new ActiveXObject("ADODB.Stream");
		adostream2.Type = 1;
		adostream2.Open();
		adostream.Position = 3; // Remove BOM
		adostream.CopyTo(adostream2);
		adostream2.Position = 0;
		adostream2.SaveToFile(filename, 2);
		adostream2.Close();
		adostream2 = null;

		adostream.Close();
		adostream = null;
	}
	
	function write(totalPath, rootPath, manifestPath) {
		var text = readFileText(manifestPath);
		writeFileText(manifestPath, text + '\\projects\\game\\' + rootPath.substr(rootPath.lastIndexOf('\\') + 1) + totalPath.substr(rootPath.length) + '\n');
	}
	write(WScript.Arguments(0), WScript.Arguments(1), WScript.Arguments(2))
})();
