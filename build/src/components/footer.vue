<template>
  <div>
    <section class="container">
      <div class="footer__text">
        <h1
          class="footer__h1"
          style="font-size: 18px; margin-bottom: 5px;"
        >XXX TUBE - Free Home Porn Videos @ homemadevids.org</h1>homemadevids.org - sex videos updated every 5 minutes.
        <br />Watch over 3 million of the best porn tube movies for FREE!
      </div>
      <section class="footer__disclaimer">
        Disclaimer: You watch free porn at the homemadevids.org. This mobile XXX website is a fully automatic adult search engine focused on hardcore sex videos for your android smart phone, iPhone or tablet. We do not own, produce or host the mobile sex clips displayed on this tube. All of the mobile free xxx movies displayed on homemadevids.org are hosted by resources that are not under our control. The linked videos are automatically gathered and added into our system by our spider script. Thumbnails are automatically generated from the XXX clips. "Categories" is just a list of the most popular search queries entered by surfers. The list of related phrases is also based on surfers search queries.
        <br />
        <br />homemadevids.org has a zero-tolerance policy against illegal pornography. We take no responsibility for the content on any website which we link to. We take no responsibility for the phrases entered by surfers. Please contact us if you have found inappropriate content.
      </section>
    </section>
    <div class="footer-copyright text-center footer_style">
      <div>
        <img class="img_logo" src="~@/assets/hmw.svg" alt />
      </div>
      <div>
        © 2019 Copyright:
        <span>HomeMadeVids</span>
      </div>
      <div>
        <a href="https://100homemade.com/form.php" target="_blank">{{ $t('ContentRemoval') }}</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Footer",
  data() {
    return {};
  }
};
</script>
<style lang="scss">
.footer {
  &_style {
    background: #2c2c34;
    color: #fff;
  }
  &-copyright {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    & > div {
      margin: auto 0;
    }
    & img {
      max-height: 50px;
    }
    & a {
      color: #fff;
    }
    @media screen and (max-width: 600px) {
      flex-direction: column;
      & > div {
        margin: 10px;
      }
    }
  }
}
.footer__text {
  padding-top: 40px;
  margin-top: 20px;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  color: #929191;
  font-size: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.26);
}
.footer__disclaimer {
  margin: 20px auto 100px;
  line-height: 20px;
  text-align: center;
  color: #929191;
  font-size: 12px;
}
</style>