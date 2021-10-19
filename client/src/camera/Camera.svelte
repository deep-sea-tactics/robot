<script lang="ts">
	export let src = "https://google.com";
</script>
<div id="camera">
	<iframe title="Camera" {src}></iframe>
</div>
<style lang="scss">
	#camera {
		background-color: gray;
		width: 50%;
		height: 50%;
		padding: 0;
		margin: 0;
		flex-grow: 1;
		text-align: center;
		color: white;

		iframe {
			width: 100%;
			height: 100%;
			padding: 0px;
			border: none;
			margin: 0px;
		}
	}
</style>