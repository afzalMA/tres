export default function aboutUs() {
  return (
    <div className=" md:container mx-auto  px-3" style={{ maxWidth: '1024px' }}>
      <div className="static-content">
        <p className="static-page-header text-xl font-bold">ABOUT US</p>
        <iframe
          className="abs-video mb-3"
          src="https://etvbharatimages.akamaized.net/player/etvbharat-staging/embed_etv.html?contenturl=https://etvbharat-vh.akamaihd.net/i/media/etv-bharat/vod/5c8635a13e6db01b4400283f_1284555_main.smil/master.m3u8&amp;thumbnailurl=&amp;autoplay=false&amp;mute=false"
        ></iframe>
        <p className="text-justify">
          ETV Bharat – A Division of Ushodaya Enterprises Pvt. Ltd. , is a
          comprehensive digital national news platform conceived to deliver
          seamless news and information services, using video-centric Mobile App
          and Web Portals. It is first-of-its kind offering in India in terms of
          diversity and depth, dedicated journalists network, reach of 24 states
          with services in 13 languages i.e.– Hindi, Urdu, Telugu, Tamil,
          Kannada, Malayalam, Gujarati, Marathi, Bengali, Punjabi, Assamese,
          Odia and English.&nbsp; ETV Bharat is the latest initiative of the
          five-decade old multi-dimensional Ramoji Group. The Group’s highly
          successful media endeavors include : Eenadu - one of the largely
          circulated language dailies in the country , and ETV Network with
          Telugu general entertainment, infotainment and news channels. With a
          strong lineage of the most trusted media house, ETV Bharat would draw
          on its strengths of decades’ long experience and innovation.&nbsp; ETV
          Bharat will combine the new technologies of mobile and digital media
          to engage news and information seekers in a new connected world. It
          will be driven by well-established news gathering setup, technology
          specialists and other professionals.
        </p>
        <br />
        <p className="subtitle">About Ramoji Group :</p>
        <p className="text-justify">
          {' '}
          Ramoji Group is a multi-dimensional business conglomerate with forays
          covering an array of business segments. With a history of more than
          five decades, the Group made a special mark for itself through
          innovative products and services , setting industry benchmarks in
          every business segment it operates. The Ramoji Group today spans a
          broad section of business enterprises including print (Eenadu),
          broadcast (ETV under Eenadu Television Pvt. Ltd.), film production and
          distribution (Usha Kiron Movies and Mayuri), hospitality (Dolphin
          Hotels ), chit fund (Margadarsi ), retail ( Brisah and Kalanjali ) and
          FMCG ( Priya Foods). Ramoji Film City, the world’s largest film city
          as certified by Guinness Book of World Records, is today a major hub
          for films production and leisure tourism destination in India.
        </p>
        <p className="text-justify">
          {' '}
          Contents of ETV BHARAT mobile app , and www.etvbharat.com are
          copyright protected. Copy and/or reproduction and/or re-use of
          contents or any part thereof, without consent of UEPL is illegal. Such
          persons will be prosecuted.
        </p>
        <br />
      </div>
      <p className="subtitle red">Contact Us</p>
      <br />
      <p className="underline"> CORPORATE OFFICE</p>
      <br />
      <p className="text-justify"> ETV BHARAT</p>
      <br />
      <p className="text-justify">
        {' '}
        A Division of Ushodaya Enterprises Pvt. Ltd. ,
      </p>
      <br />
      <p className="text-justify"> Ramoji Film City, R.R. Distt. ,</p>
      <br />
      <p className="text-justify"> Hyderabad-501512 – Telangana -INDIA.</p>
      <br />
      <p className="text-justify"> Contact: 08415 246555</p>
      <br />
    </div>
  );
}
