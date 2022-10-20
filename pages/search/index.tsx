import {FC, useState} from "react";
import Image from "next/image"
import {
    Avatar,
    Anchor,
    Container,
    Group,
    List,
    Loader,
    Modal,
    Pagination,
    SimpleGrid,
    Text,
    TextInput
} from "@mantine/core";
import {PhotoSearch} from "tabler-icons-react";
import styles from '../../styles/Search.module.css'
import {useForm} from "@mantine/form";
import {useDebouncedValue, useScrollIntoView} from "@mantine/hooks";
import {useQuery} from "@tanstack/react-query";
import { motion } from "framer-motion";
import {PixabayResponse, searchImages} from "../../shared/functions/search.service";
import Head from "next/head";

const Search: FC<{ pixabayRes: PixabayResponse }> = (props) => {

    const pageSize = 50;

    const form = useForm({
        initialValues: {
            search: ''
        }
    })

    const [activePage, setPage] = useState(1);

    const [debouncedQuery] = useDebouncedValue(form.values.search, 200)

    const [searchResponse, setSearchResponse] = useState(props.pixabayRes)

    const searchQuery = useQuery([debouncedQuery, activePage], () => searchImages(debouncedQuery, activePage, pageSize).then(
        x => {
            x && setSearchResponse(x)
            return x
        }
    ), {
        keepPreviousData: false
    })

    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({ offset: 0 });

    const [showWelcome, setShowWelcome] = useState(true)

    const welcomeModal = (
        <>
            <Modal
                centered
                opened={showWelcome}
                onClose={() => setShowWelcome(false)}
                title={<Text size={'xl'}>Welcome MLA Consulting</Text>}
            >
                <p>This app was created using Next.js technology</p>

                <span>Features Include:</span>
                <List withPadding>
                    <List.Item>Automatic debounced searching</List.Item>
                    <List.Item>Pagination</List.Item>
                    <List.Item>Transitions</List.Item>
                    <List.Item>Static Site Generation (SSG)</List.Item>
                    <List.Item>Search Engine Optimization (SEO)</List.Item>
                    <List.Item>Image optimization</List.Item>
                </List>

                <p>Please <Anchor href="https://pixilart.media" target={'_blank'}>check out the source on my git repository</Anchor>.  Please reach out if you have any questions.</p>

                <p>Additionally, please see my first attempt using Angular at <Anchor href="https://pixilart.media" target={'_blank'}>pixilart.media</Anchor></p>

                <p> I am very excited about this opportunity and cannot wait to hear from you.
                    <br/><br/> <small>Best regards, <br/> - Edwin</small>
                </p>

            </Modal>
        </>
    );

    return (
        <>
            <Head>
                <title>Pixabay Search</title>
                <meta
                    name='description'
                    content='Search the Pixabay library for any images'
                />
            </Head>

            {welcomeModal}

            <TextInput
                className={styles.searchBox}
                placeholder="Search Images"
                color={'red'}
                {...form.getInputProps('search')}
                rightSection={
                    <Group align={'center'}>
                        {
                            searchQuery.isLoading && <Loader size={16} color={'cyan'}></Loader> ||
                            <PhotoSearch size={18} style={{display: 'block', opacity: 0.5}}/>
                        }
                    </Group>
                }
                inputWrapperOrder={['label', 'input', 'description', 'error']}
                description={
                 <Group align={'center'} position={'left'} spacing={'sm'} mt={8}>
                     <Text>Powered By</Text>
                     <a href="https://pixabay.com/">
                         <img src={'logo.svg'} alt={''} width={100} height={19.34} />
                     </a>
                 </Group>
                }

            />

            <Container size={'xl'} ref={targetRef}>
                <SimpleGrid
                    cols={4}
                    spacing={5}
                    breakpoints={[
                        { maxWidth: 'lg', cols: 3, spacing: 'md' },
                        { maxWidth: 'md', cols: 2, spacing: 'sm' }
                    ]}
                >
                    {searchResponse?.hits.map((hit, n) => {
                        return <motion.div
                            key={hit.id}
                            style={{position: 'relative'}}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: n * 0.05 }}
                            exit={{ opacity: 0, scale: 0.1 }}
                        >
                            <Image
                                src={hit.webformatURL}
                                placeholder={'blur'}
                                blurDataURL={hit.webformatURL}
                                layout={'responsive'}
                                objectFit={'cover'}
                                width={50}
                                height={50}
                                quality={50}
                            />
                            <small className={styles.caption}>
                                {hit.tags}
                            </small>
                            <Group spacing={'sm'} className={styles.user}>
                                <Avatar src={hit.userImageURL} alt='' />
                                <Text
                                    gradient={{ from: 'lightgreen', to: 'lightskyblue', deg: 40 }}
                                    variant={'gradient'}
                                    weight={'bold'}
                                    size={'lg'}
                                >
                                    {hit.user}
                                </Text>
                            </Group>
                        </motion.div>
                    })}
                </SimpleGrid>

                <Group position={'center'}>
                    <Pagination
                        sx={{marginTop: 20, marginBottom: 10}}
                        page={activePage}
                        onChange={(p) => {
                            setPage(p)
                            scrollIntoView({ alignment: 'start' })
                        }}
                        total={Math.floor((searchResponse?.totalHits || 0) / pageSize)}
                        color="cyan"
                        withControls={false}
                        withEdges
                    />
                </Group>
            </Container>

        </>
    )

}

export default Search

export async function getStaticProps() {
    const pixRes = await searchImages('', 1, 50);
    return {
        props: {
            pixabayRes: pixRes
        },
        revalidate: 3600 * 24
    };
}
