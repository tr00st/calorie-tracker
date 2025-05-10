import { Button, Card, CardActions, CardContent, CardHeader, Stack, Typography } from '@mui/material';

function AboutView() {
    return (
        <Stack spacing={5} margin="auto" marginTop={0} padding={2} maxWidth={600} alignItems="center">
            <Card>
                <CardHeader title="About" />
                <CardContent>
                    <Typography>
                        Calorie Tracker is open source software, to get a copy of the source, report an issue, or
                        contribute, check us out on GitHub.
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button href="https://github.com/tr00st/calorie-tracker" target="_blank">
                        GitHub Repo
                    </Button>
                </CardActions>
            </Card>
            <Card>
                <CardHeader title="Third Party Libraries" />
                <CardContent>
                    <Typography>
                        This software uses various open source libraries. For more information, you can view a list of all libraries
                        and their respective licenses.
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button href={`${import.meta.env.BASE_URL}/third-party-licenses.txt`} target="_blank">
                        License Information
                    </Button>
                </CardActions>
            </Card>
        </Stack>
    );
}

export default AboutView;
