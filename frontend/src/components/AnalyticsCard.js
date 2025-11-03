import { Card, CardContent, Typography } from "@mui/material";

const AnalyticsCard = ({title, value }) => {

    return (
        <Card sx={{minWidth: 180}}>
            <CardContent>
                <Typography variant="h5">{title}</Typography>
                <Typography variant="h5" color="primary">{value}</Typography>
            </CardContent>
        </Card>

    );
};
export default AnalyticsCard;