<div class = 'row d-flex dropzone-container'>
		<div class="col-sm-12 d-flex p-0">
      <div class="form-group d-flex w-100">
			<div id = "{{optional((Object) (isset($params) ? $params : []))->id ?: 'default-custom'}}" class = 'w-100 d-inline-flex align-items-start flex-wrap mt-4 dropzone dz-drop-files-here'>
        </div>
	  		<input name = 'has_images' value='0' type = 'hidden' class = 'form-control form-control-lg' />
  		</div>
		</div>
	</div>
