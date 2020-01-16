import React from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardMedia,
  CardContent,
  Typography,
  withStyles
} from "@material-ui/core";

// let lock_icon = require("../../Assets/OtherIcons/lock.png");
// let completed_icon = require("../../Assets/OtherIcons/completed.png");
// let not_supported_icon = require("../../Assets/OtherIcons/completed.png");

const GameCard = ({
  icon_path,
  assessmentName,
  card_status = "locked",
  is_module_supported,
  onPress,
  ...rest
}) => {
  const { classes } = { ...rest };
  const bannerStyles = [
    {
      lineHeight: "40px",
      zIndex: "2",
      overflow: "hidden",
      WebkitTransform: "rotateY(90deg)",
      transform: "rotateY(90deg)",
      border: "1px #fff",
      boxShadow: "0 0 0 3px #59324C,  2px 21px 5px -18px rgba(0,0,0,0.6)",
      background: "#59324C",
      textAlign: "center",
      padding: "3px",
      color: "#000"
    }
  ];
  let locked = false;
  let completed = false;

  switch (card_status) {
    case "unlocked":
      locked = false;
      completed = false;
      break;
    case "locked":
      locked = true;
      completed = false;
      bannerStyles[0]["background"] = "#f7b71d";
      bannerStyles[0]["boxShadow"] =
        "0 0 0 3px #f7b71d,  2px 21px 5px -18px rgba(0,0,0,0.6)";
      break;
    case "completed":
      locked = false;
      completed = true;
      bannerStyles[0]["background"] = "#2b580c";
      bannerStyles[0]["boxShadow"] =
        "0 0 0 3px #2b580c,  2px 21px 5px -18px rgba(0,0,0,0.6)";
      bannerStyles[0]["color"] = "#fff";
      break;
    default:
      locked = false;
      completed = false;
      break;
  }

  if(!is_module_supported){
    bannerStyles[0]["background"] = "#c72c41";
    bannerStyles[0]["boxShadow"] =
      "0 0 0 3px #c72c41,  2px 21px 5px -18px rgba(0,0,0,0.6)";
  }

  return (
    <Card className={classes.card}>
      {/* {locked && <Image source={lock_icon} style={styles.itemBadge} />}
      {completed && <Image source={completed_icon} style={styles.itemBadge} />} */}

      <CardMedia
        className={classes.cardMedia}
        image={icon_path}
        title="Image title"
      >
        {!is_module_supported && (
          <span style={bannerStyles[0]}>
            {"Not Supported"}
          </span>
        )}
        {is_module_supported && (locked || completed) && (
          <span style={bannerStyles[0]}>
            {locked && "Locked"}
            {completed && "Completed"}
          </span>
        )}
      </CardMedia>
      <CardContent className={classes.cardContent}>
        <Typography
          gutterBottom
          variant="body2"
          color="textSecondary"
          component="p"
          style={{ justifyContent: "center" }}
        >
          {assessmentName}
        </Typography>
      </CardContent>
      <CardActions style={{ justifyContent: "center" }}>
        {is_module_supported && (
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={onPress}
            disabled={locked || completed}
            className={classes.roundedButton}
          >
            {(locked && "Module Locked") ||
              (completed && "Module Completed") ||
              "Start Module"}
          </Button>
        )}
        {!is_module_supported && (
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={onPress}
            disabled={true}
            className={classes.roundedButton}
          >
            {"Not Supported in Web"}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

const styles = theme => ({
  item: {
    minWidth: "375px",
    // maxWidth: "300px",
    margin: "1em",
    textAlign: "center",
    boxSizing: "border-box"
  },
  media: {
    height: "200px"
  },
  controls: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 3, 2, 3),
    justifyContent: "space-between"
  },
  roundedButton: {
    borderRadius: 15,
    padding: theme.spacing(1, 3),
    textTransform: "capitalize"
  },
  icon: {
    marginRight: theme.spacing(2)
  },
  /* heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  }, */
  heroButtons: {
    marginTop: theme.spacing(4)
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    height: "180px",
    paddingTop: "10px" // 16:9
  },
  cardContent: {
    flexGrow: 1,
    justifyContent: "center",
    margin: "auto"
  },
  /*  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6)
  }, */
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    },
    ul: {
      margin: 0,
      padding: 0
    },
    li: {
      listStyle: "none"
    }
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    position: "relative"
  },
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  toolbarTitle: {
    flexGrow: 1
  },
  logoTitle: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  link: {
    margin: theme.spacing(1, 1.5)
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6)
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[200]
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing(2)
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6)
    }
  }
});

export default withStyles(styles)(GameCard);
