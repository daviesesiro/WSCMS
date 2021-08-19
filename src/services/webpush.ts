import webpush from "web-push";

webpush.setVapidDetails(
  `mailto:${process.env.EMAIL}`,
  process.env.VAPID_PUBLIC as string,
  process.env.VAPID_PRIVATE as string
);

export default webpush;
