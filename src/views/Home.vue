<template>
  <div id="home">
    <nav>
      <ul>
        <li>
          <router-link to="/piano">Piano Test</router-link>
        </li>

        <li>
          <router-link to="/circle">Circle of Fifths Test</router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "home-view"
}
</script>

<style>
ul {
  list-style-type: none;
}
</style>
