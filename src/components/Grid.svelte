<script>
</script>

<div class="grid">
  <div class="test">hi</div>
</div>

<style>
  .grid {
    height: 100vh;
    font-size: 13px;
    overflow-y: auto;
    overflow-x: auto;
    color: black;
    z-index: 200;
    pointer-events: all;
    flex-grow: 1;
    background-image: linear-gradient(to right, grey 1px, transparent 1px),
      linear-gradient(to bottom, grey 1px, white 1px);
    background-size: 20px 20px;
    position: relative;
  }

  .test {
    background: blue;
    color: white;
    height: 100px;
    width: 100px;
    top: 20px;
    left: 20px;
    position: absolute;
  }
</style>
